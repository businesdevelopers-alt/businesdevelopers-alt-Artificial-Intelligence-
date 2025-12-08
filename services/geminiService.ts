
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyticalQuestion, ApplicantProfile, UserProfile, Question, ProjectEvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

// --- Filtration System Logic ---

export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
  const prompt = `
    قم بإنشاء 5 أسئلة تحليلية وذكاء أعمال (Business Intelligence) لتقييم رائد أعمال متقدم لحاضنة أعمال.
    
    بيانات المتقدم:
    - المجال: ${profile.sector}
    - مرحلة المشروع: ${profile.projectStage}
    - المستوى التقني: ${profile.techLevel}

    المتطلبات:
    1. الأسئلة يجب أن تتدرج في الصعوبة.
    2. نوع الأسئلة: مزيج بين حسابات مالية بسيطة (Unit Economics)، تحليل موقف إداري، ومنطق برمجي/تقني.
    3. الرد يجب أن يكون JSON Array صارم.

    Format:
    [
      {
        "id": number,
        "text": "السؤال",
        "type": "choice" | "analysis" | "math",
        "difficulty": "Easy" | "Medium" | "Hard",
        "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
        "correctIndex": number (0-3)
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["choice", "analysis", "math"] },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER }
            },
            required: ["id", "text", "type", "difficulty", "options", "correctIndex"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback static questions
    return [
      {
        id: 1,
        text: "إذا كانت تكلفة الاستحواذ على العميل (CAC) 50$ والقيمة العمرية (LTV) 40$، ماذا تفعل؟",
        type: "analysis",
        difficulty: "Easy",
        options: ["أزيد ميزانية التسويق", "أوقف الحملات وأحسن المنتج/التسعير", "أوظف المزيد من المبيعات", "لاشيء، هذا طبيعي في البداية"],
        correctIndex: 1
      },
      {
        id: 2,
        text: "أي من المؤشرات التالية هو الأهم لشركة SaaS في مرحلة النمو؟",
        type: "choice",
        difficulty: "Medium",
        options: ["عدد الموظفين", "MRR (الإيرادات الشهرية المتكررة)", "عدد المتابعين", "إجمالي التكاليف"],
        correctIndex: 1
      },
      {
        id: 3,
        text: "لديك 1000 مستخدم، 5% منهم يشترون الخدمة بسعر 100$. كم إجمالي الإيرادات؟",
        type: "math",
        difficulty: "Medium",
        options: ["500$", "5000$", "1000$", "50000$"],
        correctIndex: 1
      }
    ];
  }
};

export const evaluateProjectIdea = async (ideaText: string, profile: ApplicantProfile): Promise<ProjectEvaluationResult> => {
  const prompt = `
    أنت خبير تقييم مشاريع في مسرعة أعمال.
    قم بتحليل فكرة المشروع التالية بناءً على 5 محاور رئيسية.
    
    بيانات المشروع:
    - المجال: ${profile.sector}
    - المرحلة: ${profile.projectStage}
    - وصف الفكرة: "${ideaText}"

    المطلوب:
    1. تقييم كل محور من 0 إلى 20.
    2. المجموع الكلي من 100.
    3. رأي الذكاء الاصطناعي (فقرة قصيرة مفيدة).
    4. التصنيف (Green = جاهز للاحتضان، Yellow = يحتاج تطوير، Red = غير واضح).

    المحاور:
    - clarity: وضوح الفكرة وتحديد المشكلة والحل.
    - value: القيمة المقترحة والفائدة للعميل.
    - innovation: التميز والابتكار مقارنة بالسوق.
    - market: الجدوى السوقية وحجم السوق.
    - readiness: الجاهزية للتنفيذ وقابلية التطبيق.

    JSON Output Format:
    {
      "clarity": number,
      "value": number,
      "innovation": number,
      "market": number,
      "readiness": number,
      "totalScore": number,
      "aiOpinion": "string",
      "classification": "Green" | "Yellow" | "Red"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clarity: { type: Type.NUMBER },
            value: { type: Type.NUMBER },
            innovation: { type: Type.NUMBER },
            market: { type: Type.NUMBER },
            readiness: { type: Type.NUMBER },
            totalScore: { type: Type.NUMBER },
            aiOpinion: { type: Type.STRING },
            classification: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] }
          },
          required: ["clarity", "value", "innovation", "market", "readiness", "totalScore", "aiOpinion", "classification"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No evaluation generated");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error evaluating project:", error);
    return {
      clarity: 15, value: 15, innovation: 10, market: 12, readiness: 10,
      totalScore: 62,
      aiOpinion: "فكرة واعدة ولكن تحتاج إلى مزيد من التفصيل في خطة التنفيذ وتحليل المنافسين.",
      classification: "Yellow"
    };
  }
};

// --- Accelerator Level Logic ---

export const generateLevelMaterial = async (levelId: number, levelTitle: string, user: UserProfile): Promise<{ content: string; exercise: string }> => {
  const prompt = `
    أنت مرشد أعمال ذكي. قم بإنشاء محتوى تعليمي للمستوى رقم ${levelId}: "${levelTitle}" لرائد أعمال.
    
    بيانات المشروع:
    - الاسم: ${user.startupName}
    - الوصف: ${user.startupDescription}
    - المجال: ${user.industry}

    المطلوب:
    1. محتوى تعليمي (content): نص غني ومفيد يشرح المفاهيم الأساسية لهذا المستوى، مع أمثلة تطبيقية تناسب مجال المشروع المحدد. (حوالي 300 كلمة).
    2. تمرين عملي (exercise): سؤال تطبيقي واحد يطلب من رائد الأعمال تطبيق ما تعلمه على مشروعه الخاص.

    Output JSON Format:
    {
      "content": "string (markdown allowed)",
      "exercise": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            exercise: { type: Type.STRING }
          },
          required: ["content", "exercise"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating level material:", error);
    return {
      content: `مرحباً بك في المستوى ${levelId}. في هذا المستوى سنتعلم أساسيات ${levelTitle}. \n\nيعتبر هذا الموضوع حيوياً لنجاح أي شركة ناشئة في مجال ${user.industry}. عليك التركيز على فهم احتياجات عملائك وكيفية تلبيتها بكفاءة.\n\nقم بمراجعة المصادر الإضافية واستعد للتطبيق العملي.`,
      exercise: `بناءً على ما تعلمته، كيف يمكنك تطبيق مفاهيم ${levelTitle} على مشروعك "${user.startupName}"؟ اشرح في 3 نقاط.`
    };
  }
};

export const generateLevelQuiz = async (levelId: number, levelTitle: string, user: UserProfile): Promise<Question[]> => {
  const prompt = `
    قم بإنشاء اختبار قصير (3 أسئلة) للمستوى ${levelId}: "${levelTitle}".
    يجب أن تكون الأسئلة ذات صلة بمجال ريادة الأعمال وبشكل عام تناسب سياق مشروع في قطاع: ${user.industry}.

    Output JSON Format:
    [
      {
        "id": number,
        "text": "السؤال",
        "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
        "correctIndex": number (0-3),
        "explanation": "شرح للإجابة الصحيحة"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No quiz generated");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [
      {
        id: 1,
        text: `ما هو العنصر الأهم عند البدء في ${levelTitle}؟`,
        options: ["التمويل", "الفريق", "فهم المشكلة", "التسويق"],
        correctIndex: 2,
        explanation: "فهم المشكلة هو حجر الزاوية لأي حل ناجح."
      },
      {
        id: 2,
        text: "أي مما يلي يعتبر مؤشراً جيداً للنجاح في هذا المستوى؟",
        options: ["زيادة المتابعين", "رضا العملاء", "كثرة الميزات", "جمال التصميم"],
        correctIndex: 1,
        explanation: "رضا العملاء هو الدليل الحقيقي على القيمة."
      },
      {
        id: 3,
        text: "ما الخطأ الشائع الذي يقع فيه الرواد في هذه المرحلة؟",
        options: ["الاستعجال", "التفكير الزائد", "تجاهل العملاء", "كل ما سبق"],
        correctIndex: 3,
        explanation: "كل هذه أخطاء شائعة يجب تجنبها."
      }
    ];
  }
};

export const evaluateExerciseResponse = async (exercisePrompt: string, userAnswer: string): Promise<{ passed: boolean; feedback: string }> => {
  const prompt = `
    أنت مقيم أعمال خبير.
    سؤال التمرين: "${exercisePrompt}"
    إجابة رائد الأعمال: "${userAnswer}"

    قيم الإجابة. هل هي مقبولة وتدل على فهم جيد؟ (passed: true/false).
    قدم تعليقاً (feedback) بناءً ومشجعاً.

    Output JSON:
    {
      "passed": boolean,
      "feedback": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["passed", "feedback"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No evaluation generated");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error evaluating exercise:", error);
    return {
      passed: true,
      feedback: "إجابة جيدة. أحسنت المحاولة! (تعذر الاتصال بالخادم للتحليل الدقيق)"
    };
  }
};

export const createPathFinderChat = () => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `
        أنت "المستشار الذكي" لحاضنة الأعمال. دورك هو محاورة رواد الأعمال لتقييم أفكارهم وتوجيههم.
        
        أسلوبك:
        - ودود، محفز، ومحترف.
        - اسأل أسئلة قصيرة ومباشرة (سؤال واحد في كل مرة) لفهم المشروع.
        - المحاور: المشكلة، الحل، السوق المستهدف، والميزة التنافسية.
        
        الهدف:
        بعد فهم الفكرة (عادة بعد 3-5 أسئلة)، عليك اتخاذ قرار: هل المشروع مؤهل للانضمام للحاضنة؟
        
        إذا اتخذت القرار، يجب أن يكون ردك متضمناً لكتلة JSON مخفية (داخل \`\`\`json ... \`\`\`) بالصيغة التالية، بالإضافة إلى رسالة وداعية لطيفة للمستخدم خارج الـ JSON.
        
        JSON Format for decision:
        {
          "decision": "APPROVED" | "REJECTED",
          "reason": "سبب القرار في جملة واحدة",
          "feedback": "نصيحة مفصلة للمستخدم"
        }

        معايير القبول:
        - مشكلة واضحة وحل منطقي.
        - سوق واعد.
        - جدية من المؤسس.
      `,
    },
  });
};

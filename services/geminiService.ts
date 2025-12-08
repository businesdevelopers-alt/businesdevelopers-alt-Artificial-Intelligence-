
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserProfile, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// --- Path Finder Chat Logic ---

export const createPathFinderChat = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      temperature: 0.7,
      systemInstruction: `
        أنت "مقيّم المشاريع" في مسرعة الأعمال الذكية (AI Accelerator).
        هدفك هو إجراء مقابلة قصيرة مع المستخدم لتحديد ما إذا كان جاهزاً للانضمام للمسرعة أم لا.
        
        القواعد:
        1. تحدث باللغة العربية بلهجة مهنية وودودة.
        2. ابدأ بالترحيب واسأل عن اسم المستخدم ونبذة بسيطة عنه.
        3. اطرح 3-4 أسئلة متتالية (سؤال واحد في كل مرة) لتقييم:
           - وضوح فكرة المشروع.
           - خبرة المستخدم في المجال.
           - التفرغ والجدية.
           - حجم السوق المستهدف (هل هو مشروع ريادي قابل للنمو أم مشروع تقليدي صغير).
        4. بعد الحصول على إجابات كافية، قرر النتيجة.
        
        القرار النهائي:
        عندما تتخذ القرار، يجب أن يكون ردك يتضمن نصاً عادياً للمستخدم (تهنئة أو نصيحة)، وفي نهاية الرسالة تماماً، أضف كتلة JSON صارمة بهذا الشكل لكي يفهمها النظام:
        
        \`\`\`json
        {
          "decision": "APPROVED" أو "REJECTED",
          "reason": "سبب القرار باختصار",
          "feedback": "نصيحة للمستخدم"
        }
        \`\`\`

        - APPROVED: إذا كان المشروع ريادياً (Start-up) ولديه فرص نمو والمؤسس جاد.
        - REJECTED: إذا كانت الفكرة غامضة جداً، أو مجرد مشروع تقليدي جداً (مثل بقالة صغيرة) لا يحتاج مسرعة نمو، أو عدم وجود جدية.
      `,
    },
  });
};

// --- Existing Level Logic ---

// Helper to generate the educational content for a specific level
export const generateLevelMaterial = async (levelId: number, levelTitle: string, user: UserProfile): Promise<{ content: string; exercise: string }> => {
  const prompt = `
    أنت مرشد أعمال خبير في مسرعة الأعمال افتراضية.
    رائد الأعمال لديه مشروع باسم "${user.startupName}" في مجال "${user.industry}".
    وصف المشروع: "${user.startupDescription}".

    المطلوب: قم بإنشاء محتوى تعليمي للمستوى رقم ${levelId} وعنوانه "${levelTitle}".
    
    1. قدم شرحاً عملياً ومباشراً ومختصراً (حوالي 300-400 كلمة) يربط مفاهيم هذا المستوى بمشروع المستخدم المحدد. تجنب الكلام النظري العام قدر الإمكان.
    2. في النهاية، اقترح تمريناً عملياً واحداً (سؤال مفتوح) ليقوم رائد الأعمال بحله.

    يجب أن يكون الرد بصيغة JSON:
    {
      "content": "نص الشرح التعليمي هنا...",
      "exercise": "نص السؤال أو التمرين العملي هنا..."
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
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating material:", error);
    throw error;
  }
};

// Helper to generate a quiz for the level
export const generateLevelQuiz = async (levelId: number, levelTitle: string, user: UserProfile): Promise<Question[]> => {
  const prompt = `
    بناءً على موضوع المستوى ${levelId}: "${levelTitle}" لمشروع "${user.startupName}".
    قم بإنشاء اختبار قصير مكون من 3 أسئلة اختيار من متعدد (Multiple Choice) للتأكد من فهم رائد الأعمال للمفاهيم الأساسية لهذا المستوى.

    الرد يجب أن يكون JSON Array.
    أضف حقلاً "explanation" لكل سؤال يشرح باختصار لماذا الإجابة الصحيحة هي الصحيحة.
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
              text: { type: Type.STRING, description: "نص السؤال" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "4 خيارات للإجابة" 
              },
              correctIndex: { type: Type.INTEGER, description: "رقم الإجابة الصحيحة (0-3)" },
              explanation: { type: Type.STRING, description: "شرح موجز للإجابة الصحيحة" }
            },
            required: ["id", "text", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No quiz response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Return dummy data on failure to not break the app flow
    return [
      {
        id: 1,
        text: "حدث خطأ في توليد الأسئلة، أي مما يلي صحيح؟",
        options: ["الاستمرار", "التوقف", "إعادة المحاولة", "تجاهل"],
        correctIndex: 0,
        explanation: "يرجى المحاولة مرة أخرى لاحقاً."
      }
    ];
  }
};

// Helper to evaluate the open-ended exercise
export const evaluateExerciseResponse = async (question: string, userAnswer: string): Promise<{ passed: boolean; feedback: string }> => {
  const prompt = `
    بصفتك خبير أعمال، قم بتقييم إجابة رائد الأعمال على التمرين التالي.
    السؤال: "${question}"
    إجابة المستخدم: "${userAnswer}"

    هل الإجابة مقبولة وتظهر فهمًا جيدًا؟ (نعم/لا).
    قدم نصيحة قصيرة ومفيدة لتحسين الإجابة.

    الرد JSON:
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
    if (!text) throw new Error("No evaluation response");
    return JSON.parse(text);
  } catch (error) {
    return { passed: true, feedback: "تم قبول الإجابة (تعذر الاتصال بالمدقق الآلي)." };
  }
};

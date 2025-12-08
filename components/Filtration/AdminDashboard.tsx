
import React from 'react';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">لوحة إدارة الحاضنة</h1>
          <button onClick={onBack} className="text-blue-600 font-bold text-sm">خروج</button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase mb-2">إجمالي المتقدمين</p>
            <p className="text-3xl font-extrabold text-slate-900">142</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase mb-2">المؤهلين (Qualified)</p>
            <p className="text-3xl font-extrabold text-green-600">38</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-400 text-xs font-bold uppercase mb-2">القادة الأخلاقيين</p>
             <p className="text-3xl font-extrabold text-blue-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-400 text-xs font-bold uppercase mb-2">معدل القبول</p>
             <p className="text-3xl font-extrabold text-slate-700">26%</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">أوامر سريعة</h3>
              <div className="space-y-3">
                 <button className="w-full text-right p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors flex justify-between">
                    <span>أصدر تقرير الترشيح الكامل (Excel)</span>
                    <span>📥</span>
                 </button>
                 <button className="w-full text-right p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors flex justify-between">
                    <span>أرني وسام القائد الأخلاقي فقط</span>
                    <span>🏅</span>
                 </button>
                 <button className="w-full text-right p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors flex justify-between">
                    <span>تكوين فرق متوازنة تلقائياً (AI Team Formation)</span>
                    <span>🤖</span>
                 </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">توزيع القطاعات</h3>
              <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                     <span>تقني</span>
                     <span>45%</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full w-[45%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                     <span>خدمي</span>
                     <span>30%</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-indigo-500 h-full w-[30%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                     <span>صناعي</span>
                     <span>25%</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-orange-500 h-full w-[25%]"></div>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

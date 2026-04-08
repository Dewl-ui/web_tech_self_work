// pages/components/DynamicQuestionEditor.jsx
import React from 'react';
//
const DynamicQuestionEditor = ({ typeId, formData, setFormData }) => {
  if (!typeId) {
    return (
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center">
        <p className="text-gray-500 text-lg">
          Асуултын төрлийг сонгоно уу...
        </p>
      </div>
    );
  }

  const updateForm = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Асуултын төрлийн ID-г backend-ээс авсан бодит ID-тай тааруулна уу!
  switch (String(typeId)) {
    case '1': // True / False
      return <TrueFalseEditor formData={formData} updateForm={updateForm} />;

    case '2': // Нэг сонголттой (Single Choice)
      return <SingleChoiceEditor formData={formData} updateForm={updateForm} />;

    case '3': // Олон сонголттой (Multiple Choice)
      return <MultipleChoiceEditor formData={formData} updateForm={updateForm} />;

    case '4': // Бичих (Essay / Long answer)
      return <EssayEditor formData={formData} updateForm={updateForm} />;

    // Дараа нэмэх боломжтой төрлүүд:
    // case '5': // Нөхөх (Fill in the blank)
    // case '6': // Харгалзуулах (Matching)
    // case '7': // Багц асуулт (Group/Parent question)

    default:
      return (
        <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-xl">
          <p className="text-yellow-700">
            Энэ асуултын төрөл ({typeId}) одоогоор хөгжүүлэлт хийгдээгүй байна.
          </p>
        </div>
      );
  }
};

export default DynamicQuestionEditor;

// ====================== True/False Editor ======================
const TrueFalseEditor = ({ formData, updateForm }) => {
  const handleAnswerChange = (value) => {
    updateForm({ answer: value });   // backend-д "true" эсвэл "false" string-ээр хадгална
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Зөв хариулт</label>
      <div className="flex gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="truefalse"
            checked={formData.answer === 'true'}
            onChange={() => handleAnswerChange('true')}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="text-lg">Үнэн (True)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="truefalse"
            checked={formData.answer === 'false'}
            onChange={() => handleAnswerChange('false')}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="text-lg">Худал (False)</span>
        </label>
      </div>
    </div>
  );
};

// ====================== Single Choice Editor ======================
const SingleChoiceEditor = ({ formData, updateForm }) => {
  const options = formData.options || [];

  const addOption = () => {
    updateForm({
      options: [...options, { id: Date.now(), text: '', isCorrect: false }]
    });
  };

  const updateOption = (id, text) => {
    updateForm({
      options: options.map(opt => opt.id === id ? { ...opt, text } : opt)
    });
  };

  const toggleCorrect = (id) => {
    updateForm({
      options: options.map(opt => ({
        ...opt,
        isCorrect: opt.id === id
      })),
      answer: id   // зөв хариултын option-ийн id-г answer талбарт хадгална
    });
  };

  const removeOption = (id) => {
    updateForm({
      options: options.filter(opt => opt.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Сонголтууд</label>
        <button
          type="button"
          onClick={addOption}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Сонголт нэмэх
        </button>
      </div>

      {options.length === 0 && (
        <p className="text-gray-500 italic">Сонголт нэмнэ үү...</p>
      )}

      <div className="space-y-3">
        {options.map((opt, index) => (
          <div key={opt.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-400 font-medium w-6">{index + 1}.</span>
            
            <input
              type="text"
              value={opt.text}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              placeholder={`Сонголт ${index + 1}`}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="radio"
              name="correctSingle"
              checked={formData.answer === opt.id}
              onChange={() => toggleCorrect(opt.id)}
              className="w-5 h-5 accent-green-600"
            />
            <span className="text-sm text-green-600 whitespace-nowrap">Зөв</span>

            <button
              type="button"
              onClick={() => removeOption(opt.id)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ====================== Multiple Choice Editor ======================
const MultipleChoiceEditor = ({ formData, updateForm }) => {
  const options = formData.options || [];

  const addOption = () => {
    updateForm({
      options: [...options, { id: Date.now(), text: '', isCorrect: false }]
    });
  };

  const updateOption = (id, text) => {
    updateForm({
      options: options.map(opt => opt.id === id ? { ...opt, text } : opt)
    });
  };

  const toggleCorrect = (id) => {
    const newOptions = options.map(opt =>
      opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
    );
    updateForm({
      options: newOptions,
      answer: newOptions.filter(o => o.isCorrect).map(o => o.id)   // массив хэлбэрээр
    });
  };

  const removeOption = (id) => {
    updateForm({
      options: options.filter(opt => opt.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Олон сонголттой (Multiple Choice)</label>
        <button
          type="button"
          onClick={addOption}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Сонголт нэмэх
        </button>
      </div>

      <div className="space-y-3">
        {options.map((opt, index) => (
          <div key={opt.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-400 font-medium w-6">{index + 1}.</span>
            
            <input
              type="text"
              value={opt.text}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              placeholder={`Сонголт ${index + 1}`}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="checkbox"
              checked={opt.isCorrect}
              onChange={() => toggleCorrect(opt.id)}
              className="w-5 h-5 accent-green-600"
            />
            <span className="text-sm text-green-600">Зөв</span>

            <button
              type="button"
              onClick={() => removeOption(opt.id)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ====================== Essay Editor ======================
const EssayEditor = ({ formData, updateForm }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Бичих асуулт (Essay) – багш гар аргаар шалгана
      </label>
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center">
        <p className="text-gray-500">
          Оюутан энд урт текст бичнэ. Зөв хариулт байхгүй (эсвэл жишээ хариулт бичнэ).
        </p>
      </div>

      {/* Хэрэв багш жишээ хариулт өгөхийг хүсвэл нэмж болно */}
      <textarea
        placeholder="Жишээ зөв хариулт (optional)"
        value={formData.answer || ''}
        onChange={(e) => updateForm({ answer: e.target.value })}
        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
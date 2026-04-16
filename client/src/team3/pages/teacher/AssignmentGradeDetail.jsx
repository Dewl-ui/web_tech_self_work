import React from 'react';
import { Link } from 'react-router-dom';
import { PageTitle, Panel, Shell, SmallButton } from '../../components/common';

export default function AssignmentGradeDetail() {
  return (
    <Shell role="teacher">
      <PageTitle title="Даалгаврын үнэлгээний задаргаа" />
      <Panel className="max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Лаборатори 1</h2>
          <SmallButton as={Link} to=".." relative="path">← Журнал руу буцах</SmallButton>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between">
            <span className="font-semibold text-slate-600">Оюутан: Б. Бат-Эрдэнэ (B200910101)</span>
            <span className="font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-sm">Авсан: 15 / 15 оноо</span>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-slate-700 mb-2">Багшийн үлдээсэн сэтгэгдэл:</h4>
            <div className="bg-sky-50 text-sky-800 p-4 rounded-xl border border-sky-100 text-sm leading-relaxed">Даалгаврыг маш сайн ойлгож, кодын бүтцийг цэвэрхэн бичсэн байна. Хугацаандаа илгээсэн тул бүрэн оноо өгөв.</div>
            <div className="mt-6">
              <h4 className="font-bold text-slate-700 mb-2">Хавсралт файл:</h4>
              <a href="#" className="text-indigo-600 hover:underline flex items-center gap-2 font-medium">📄 lab1_baterdene.zip</a>
            </div>
          </div>
        </div>
      </Panel>
    </Shell>
  );
}
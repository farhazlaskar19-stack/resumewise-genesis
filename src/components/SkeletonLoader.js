import React from 'react';

export const SkeletonLoader = ({ className = "", children }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-slate-700/50 rounded-lg h-4 mb-2"></div>
    <div className="bg-slate-700/50 rounded-lg h-4 w-3/4 mb-2"></div>
    <div className="bg-slate-700/50 rounded-lg h-4 w-1/2"></div>
    {children}
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-700/50 rounded-xl h-12"></div>
      <div className="bg-slate-700/50 rounded-xl h-12"></div>
    </div>
    <div className="bg-slate-700/50 rounded-xl h-32"></div>
    <div className="bg-slate-700/50 rounded-xl h-12 w-1/2"></div>
  </div>
);

export const TemplateSkeleton = () => (
  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-8 h-[380px] md:h-[420px] flex flex-col justify-between animate-pulse">
    <div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-700/50 rounded-2xl mb-6 md:mb-8"></div>
      <div className="bg-slate-700/50 rounded-lg h-4 w-1/3 mb-4"></div>
      <div className="bg-slate-700/50 rounded-lg h-6 w-3/4 mb-2"></div>
      <div className="bg-slate-700/50 rounded-lg h-3 w-full"></div>
    </div>
    <div className="pt-4 md:pt-6 border-t border-white/5 flex justify-between items-center">
      <div className="bg-slate-700/50 rounded-lg h-3 w-1/4"></div>
      <div className="bg-slate-700/50 rounded-lg w-7 h-7 md:w-8 md:h-8"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="bg-slate-700/50 rounded-2xl h-20 w-full"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-700/50 rounded-2xl h-32"></div>
      <div className="bg-slate-700/50 rounded-2xl h-32"></div>
      <div className="bg-slate-700/50 rounded-2xl h-32"></div>
    </div>
    <div className="bg-slate-700/50 rounded-2xl h-64 w-full"></div>
  </div>
);

export const ResumePreviewSkeleton = () => (
  <div className="bg-white shadow-2xl rounded-lg overflow-hidden animate-pulse" style={{minHeight: '297mm'}}>
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-slate-300 rounded-full w-16 h-16"></div>
        <div className="space-y-2 flex-1">
          <div className="bg-slate-300 rounded h-6 w-1/3"></div>
          <div className="bg-slate-300 rounded h-4 w-1/2"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-300 rounded h-4 w-full"></div>
        <div className="bg-slate-300 rounded h-4 w-5/6"></div>
        <div className="bg-slate-300 rounded h-4 w-4/6"></div>
      </div>
      <div className="border-t pt-6 space-y-4">
        <div className="bg-slate-300 rounded h-4 w-1/4"></div>
        <div className="bg-slate-300 rounded h-3 w-full"></div>
        <div className="bg-slate-300 rounded h-3 w-5/6"></div>
      </div>
    </div>
  </div>
);

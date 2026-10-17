import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Trash2, 
  Lock, 
  Plus, 
  Eye, 
  HardDrive, 
  KeyRound, 
  ExternalLink, 
  MessageSquare
} from 'lucide-react';
import { User, UserDocument, ChatMessage } from '../types';
import { storage } from '../services/storage';
import { UserAvatar } from './UserAvatar';

interface PrivateVaultViewProps {
  currentUser: User;
  onOpenChatWithDoc: (doc: UserDocument) => void;
}

export const PrivateVaultView: React.FC<PrivateVaultViewProps> = ({
  currentUser,
  onOpenChatWithDoc,
}) => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docContent, setDocContent] = useState('');
  const [activePreviewDoc, setActivePreviewDoc] = useState<UserDocument | null>(null);

  useEffect(() => {
    loadUserData();
  }, [currentUser.id]);

  const loadUserData = () => {
    const docs = storage.getUserDocuments(currentUser.id);
    const userChats = storage.getUserChats(currentUser.id);
    setDocuments(docs);
    setChats(userChats);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docContent.trim()) return;

    storage.addDocument(currentUser.id, {
      name: docName.trim().endsWith('.txt') ? docName.trim() : `${docName.trim()}.txt`,
      size: `${(docContent.length / 1024).toFixed(1)} KB`,
      type: 'text/plain',
      content: docContent.trim(),
    });

    setDocName('');
    setDocContent('');
    setShowAddModal(false);
    loadUserData();
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm('আপনি কি এই প্রাইভেট ডকুমেন্টটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
      storage.deleteDocument(currentUser.id, docId);
      if (activePreviewDoc?.id === docId) setActivePreviewDoc(null);
      loadUserData();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      storage.addDocument(currentUser.id, {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'text/plain',
        content: content || 'Empty file',
      });
      loadUserData();
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Privacy Guarantee Header */}
      <div className="rounded-3xl bg-[#080d1e] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar name={currentUser.name} role={currentUser.role} size="xl" />
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>জিরো-নলেজ সিকিউরিটি অডিটেড ও পার্টিশনকৃত</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {currentUser.name} এর ব্যক্তিগত ভল্ট ও প্রাইভেসিস্পেস
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                আপনার আপলোড করা সমস্ত ফাইল, ব্যবসায়িক তথ্য এবং চ্যাট হিস্ট্রি সম্পূর্ণ আলাদা ভল্টে এনক্রিপ্ট হয়ে থাকে। অন্য কোনো গ্রাহক আপনার ফাইল দেখতে পাবে না।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/10 transition shadow">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>ফাইল আপলোড করুন</span>
              <input type="file" accept=".txt,.md,.json,.csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন নোট তৈরি করুন</span>
            </button>
          </div>
        </div>

        {/* Security Audit Details Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">পার্টিশন চাবি (Partition Key)</div>
              <div className="text-xs font-mono font-bold text-slate-200 truncate">
                nexus_user_{currentUser.id.slice(0, 10)}_vault
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">ব্যক্তিগত ফাইল সংখ্যা</div>
              <div className="text-xs font-bold text-slate-200 font-mono tabular-nums">
                {documents.length} টি সংরক্ষিত ফাইল
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">সংরক্ষিত ব্যক্তিগত চ্যাট</div>
              <div className="text-xs font-bold text-slate-200 font-mono tabular-nums">
                {chats.length} টি মেসেজ (সম্পূর্ণ গোপন)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Documents List & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Document List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-emerald-400" />
              <span>আপনার ব্যক্তিগত ডকুমেন্টস ভল্ট</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              মোট {documents.length} টি ফাইল
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-2xl bg-slate-900 border border-white/[0.08] p-8 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">আপনার কোনো ব্যক্তিগত ডকুমেন্ট নেই। নতুন নোট তৈরি বা ফাইল আপলোড করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                    activePreviewDoc?.id === doc.id
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg'
                      : 'bg-slate-900/90 border-white/[0.08] hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-xs text-white truncate max-w-[150px]">
                          {doc.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{doc.size}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {doc.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActivePreviewDoc(doc)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> প্রিভিউ
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenChatWithDoc(doc)}
                        className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition"
                        title="এই ডকুমেন্ট দিয়ে এআই এর সাথে চ্যাট করুন"
                      >
                        চ্যাট এআই ↗
                      </button>

                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Document Preview */}
        <div className="rounded-2xl bg-slate-900 border border-white/[0.08] p-5 flex flex-col h-[460px]">
          {activePreviewDoc ? (
            <div className="flex flex-col h-full space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h4 className="font-bold text-xs text-white">{activePreviewDoc.name}</h4>
                  <div className="text-[10px] text-slate-400">আপলোড সময়: {activePreviewDoc.uploadedAt}</div>
                </div>
                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-white/[0.06] text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                {activePreviewDoc.content}
              </div>

              <button
                onClick={() => onOpenChatWithDoc(activePreviewDoc)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>এই ডকুমেন্ট নিয়ে ChatGPT তে প্রশ্ন করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                ডেটা গোপনীয়তা ও সুরক্ষা
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                যেকোনো ডকুমেন্টের "প্রিভিউ" বাটনে চাপলে এখানে পূর্ণ টেক্সট প্রদর্শিত হবে।
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-white/[0.06] text-[11px] text-slate-400 text-left w-full space-y-1">
                <div className="text-emerald-400 font-bold">প্রাইভেসি নীতি:</div>
                <div>• আপনার ডকুমেন্ট দিয়ে অন্য কোনো এআই মডেলকে ট্রেনিং করানো হয় না।</div>
                <div>• অন্য কোনো ইউজার অ্যাকাউন্ট থেকে এই ডকুমেন্ট দেখার কোনো সুযোগ নেই।</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Add New Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>নতুন ব্যক্তিগত নোট তৈরি করুন</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ফাইলের নাম:</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="যেমন: My_Business_Plan.txt"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">নোট বা টেক্সট কনটেন্ট:</label>
                <textarea
                  rows={6}
                  required
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="এখানে আপনার ব্যক্তিগত তথ্য, নোট বা ব্যবসায়িক ডেটা লিখুন যা এআই অ্যানালাইসিস করবে..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>

              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> এটি শুধুমাত্র আপনার ইউজার ভল্টেই সংরক্ষিত থাকবে।
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

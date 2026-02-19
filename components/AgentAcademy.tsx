
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Save, X, BookOpen, Search, Loader2, FileText, Upload, Sparkles, RefreshCw, Eye, Globe, Lock, ArrowLeft } from 'lucide-react';
import { dbService } from '../services/dbService';
import { generateArticleContent } from '../services/geminiService';
import { KnowledgeArticle } from '../types';

const AgentAcademy: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [currentArticle, setCurrentArticle] = useState<Partial<KnowledgeArticle>>({
    title: '', category: 'Basics', content: '', isPublic: false, tags: []
  });
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genMode, setGenMode] = useState<'SEO' | 'INTERNAL'>('INTERNAL');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    const data = await dbService.getKnowledgeArticles();
    setArticles(data);
    setIsLoading(false);
  };

  const handleCreateNew = () => {
    setCurrentArticle({ 
        title: '', 
        category: 'Basics', 
        content: '', 
        isPublic: false, 
        tags: [] 
    });
    setGenTopic('');
    setAttachedFile(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (article: KnowledgeArticle) => {
    setCurrentArticle(article);
    setGenTopic(article.title);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
        await dbService.deleteKnowledgeArticle(id);
        fetchArticles();
    }
  };

  const handleSave = async () => {
    if (!currentArticle.title || !currentArticle.content) {
        alert("Title and content are required.");
        return;
    }
    
    // Auto-generate excerpt if missing
    const excerpt = currentArticle.content.substring(0, 150).replace(/[#*]/g, '') + "...";
    
    try {
        await dbService.saveKnowledgeArticle({
            ...currentArticle,
            excerpt: currentArticle.excerpt || excerpt,
            readTime: `${Math.ceil(currentArticle.content.split(' ').length / 200)} min read`
        });
        
        setIsEditorOpen(false);
        fetchArticles();
        alert("Article saved successfully!");
    } catch (e: any) {
        console.error("Failed to save article:", e);
        alert(`Failed to save article: ${e.message}`);
    }
  };

  const handleAIGenerate = async () => {
    if (!genTopic) {
        alert("Please enter a topic for the AI.");
        return;
    }
    
    setIsGenerating(true);
    try {
        let fileData;
        if (attachedFile) {
            const reader = new FileReader();
            fileData = await new Promise<{ data: string, mimeType: string }>((resolve, reject) => {
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    const base64 = result.split(',')[1];
                    resolve({ data: base64, mimeType: attachedFile.type });
                };
                reader.onerror = reject;
                reader.readAsDataURL(attachedFile);
            });
        }

        const content = await generateArticleContent(genTopic, genMode, fileData);
        
        if (content) {
            setCurrentArticle(prev => ({
                ...prev,
                title: genTopic, // Or extract title from markdown if possible
                content: content,
                isPublic: genMode === 'SEO'
            }));
        } else {
            throw new Error("AI returned empty content");
        }
    } catch (e: any) {
        console.error("AI Gen Error", e);
        alert(`AI Generation failed: ${e.message}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-8 animate-in fade-in">
      
      {/* Navigation Back */}
      <Link to="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Admin Dashboard</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white">Knowledge <span className="text-blue-400">Engine</span></h1>
          <p className="text-slate-400">Create, manage, and deploy AI-driven knowledge for internal ops and SEO.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Article
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Library List */}
        <div className={`lg:col-span-4 space-y-6 ${isEditorOpen ? 'hidden lg:block' : 'block'}`}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                placeholder="Search database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                />
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                ) : filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                        <div 
                            key={article.id} 
                            onClick={() => handleEdit(article)}
                            className="glass-card p-5 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer group transition-all"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${article.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {article.isPublic ? 'Public / SEO' : 'Internal'}
                                </span>
                                <span className="text-xs text-slate-500">{new Date(article.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{article.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2">{article.excerpt}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">No articles found.</div>
                )}
            </div>
        </div>

        {/* RIGHT: Editor / Generator */}
        <div className={`lg:col-span-8 ${!isEditorOpen ? 'hidden lg:block lg:opacity-50 pointer-events-none' : 'block'}`}>
            <div className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden flex flex-col h-[85vh]">
                {/* Editor Header */}
                <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsEditorOpen(false)} className="lg:hidden p-2 text-slate-400"><X /></button>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {currentArticle.id ? <Edit3 className="w-5 h-5 text-blue-400"/> : <Sparkles className="w-5 h-5 text-blue-400"/>}
                            {currentArticle.id ? 'Edit Article' : 'AI Generator'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setEditorMode(editorMode === 'EDIT' ? 'PREVIEW' : 'EDIT')}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            title="Toggle Preview"
                        >
                            {editorMode === 'EDIT' ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                        </button>
                        {currentArticle.id && (
                            <button onClick={() => handleDelete(currentArticle.id!)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        <button 
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg ml-2"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-8">
                    {/* AI GENERATION CONTROLS */}
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Content Generation
                            </label>
                            <div className="flex bg-slate-900 rounded-lg p-1 border border-white/10">
                                <button 
                                    onClick={() => setGenMode('INTERNAL')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${genMode === 'INTERNAL' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Internal
                                </button>
                                <button 
                                    onClick={() => setGenMode('SEO')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${genMode === 'SEO' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    SEO Blog
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <input 
                                value={genTopic}
                                onChange={e => { setGenTopic(e.target.value); setCurrentArticle(prev => ({...prev, title: e.target.value})); }}
                                placeholder="Enter topic (e.g. 'Understanding Surety Bonds' or 'How to file a claim')"
                                className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500"
                            />
                            <div className="relative">
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept=".pdf,.txt,.doc,.docx"
                                    onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`h-full px-4 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${attachedFile ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                                >
                                    {attachedFile ? <FileText className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                                    {attachedFile ? 'File Attached' : 'Attach Context'}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate Article Draft
                        </button>
                    </div>

                    {/* MANUAL EDITOR */}
                    {editorMode === 'EDIT' ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Article Title</label>
                                    <input 
                                        value={currentArticle.title}
                                        onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                                    <select 
                                        value={currentArticle.category}
                                        onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
                                        className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
                                    >
                                        <option value="Basics">Insurance Basics</option>
                                        <option value="Commercial">Commercial Lines</option>
                                        <option value="Personal">Personal Lines</option>
                                        <option value="Procedures">Agency Procedures</option>
                                        <option value="Carriers">Carrier Info</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Markdown Content</label>
                                <textarea 
                                    value={currentArticle.content}
                                    onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
                                    className="w-full h-[400px] bg-slate-950 border border-white/10 p-6 rounded-2xl text-slate-300 font-mono text-sm leading-relaxed outline-none focus:border-blue-500 resize-none"
                                    placeholder="# Article Title..."
                                />
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className={`p-2 rounded-lg ${currentArticle.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {currentArticle.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </div>
                                <div className="flex-grow">
                                    <div className="font-bold text-white text-sm">Public Visibility</div>
                                    <div className="text-xs text-slate-500">Enable to index for SEO and show on public blog.</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={currentArticle.isPublic || false} onChange={e => setCurrentArticle({...currentArticle, isPublic: e.target.checked})} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-slate-300 prose-li:text-slate-300">
                            <h1>{currentArticle.title}</h1>
                            <div className="whitespace-pre-wrap">{currentArticle.content}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAcademy;

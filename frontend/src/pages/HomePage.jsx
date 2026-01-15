import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Link, Type, AlertCircle, User, ListFilter
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const HomePage = () => {
    const navigate = useNavigate();
    const [inputType, setInputType] = useState('text'); // 'text' or 'url'
    const [textInput, setTextInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [background, setBackground] = useState('');
    const [sourceCategory, setSourceCategory] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemma');

    const [error, setError] = useState('');

    const handleAnalyze = () => {
        const inputToAnalyze = inputType === 'text' ? textInput : urlInput;

        if (!inputToAnalyze.trim()) {
            setError(`Please enter some ${inputType} to analyze.`);
            return;
        }

        if (!sourceCategory) {
            setError("Please select a source category.");
            return;
        }

        setError('');

        // Navigate to results page with data
        navigate('/results', {
            state: {
                text: inputType === 'text' ? textInput : null,
                url: inputType === 'url' ? urlInput : null,
                inputType,
                background,
                sourceCategory,
                selectedModel
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#020817] text-white font-sans flex flex-col relative overflow-hidden selection:bg-teal-500/30">

            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-start px-4 py-12 relative z-10 max-w-5xl mx-auto w-full space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 pb-5">
                        Verify the Truth
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Advanced AI analysis to detect misinformation, manipulation, and bias in seconds.
                    </p>
                </motion.div>

                {/* Instructions Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-3xl bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 text-left space-y-3"
                >
                    <h3 className="text-blue-400 font-semibold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        How it works
                    </h3>
                    <div className="text-gray-300 text-sm space-y-2">
                        <p>
                            <strong>1. Input Content:</strong> Paste the text you want to verify or provide a URL to the article.
                        </p>
                        <p>
                            <strong>2. Provide Context:</strong> Tell us who the source is (e.g., "Anonymous Blog", "Verified News Outlet") and select the category.
                        </p>
                        <p>
                            <strong>3. Analyze:</strong> Our AI will cross-reference the content, analyze linguistic patterns, and provide a truthfulness score.
                        </p>
                    </div>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-4 shadow-2xl"
                >
                    {/* Toggle Switch */}
                    <div className="flex p-1 bg-black/20 rounded-2xl mb-6 w-fit mx-auto">
                        <button
                            onClick={() => setInputType('text')}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-l-xl rounded-r-none text-sm font-medium transition-all duration-300 ${inputType === 'text' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Type className="w-4 h-4" />
                            <span>Text</span>
                        </button>
                        <button
                            onClick={() => setInputType('url')}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-r-xl rounded-l-none text-sm font-medium transition-all duration-300 ${inputType === 'url' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Link className="w-4 h-4" />
                            <span>URL</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-6 space-y-6">

                        {/* Main Input (Text or URL) */}
                        <AnimatePresence mode="wait">
                            {inputType === 'text' ? (
                                <motion.div
                                    key="text-input"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Textarea
                                        placeholder="Paste the suspicious text here..."
                                        className="w-full bg-black/20 border-white/10 text-white placeholder:text-gray-500 min-h-[150px] rounded-2xl p-6 text-lg resize-none focus-visible:ring-2 focus-visible:ring-teal-500/50 transition-all"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="url-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Input
                                        placeholder="Paste the article URL..."
                                        className="w-full bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-16 rounded-2xl px-6 text-lg focus-visible:ring-2 focus-visible:ring-teal-500/50 transition-all"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Additional Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Background Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Source Background
                                </label>
                                <Input
                                    placeholder="e.g., Anonymous user, Verified journalist..."
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                                    value={background}
                                    onChange={(e) => setBackground(e.target.value)}
                                />
                            </div>

                            {/* Source Category Dropdown */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                                    <ListFilter className="w-4 h-4" /> Source Category
                                </label>
                                <Select value={sourceCategory} onValueChange={setSourceCategory}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white h-12 rounded-xl">
                                        <SelectValue placeholder="Select category..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                                        <SelectItem value="social_media">Social Media Post</SelectItem>
                                        <SelectItem value="video_platform">Video Sharing Platform</SelectItem>
                                        <SelectItem value="blog">Personal Blog</SelectItem>
                                        <SelectItem value="news_site">News Website</SelectItem>
                                        <SelectItem value="forum">Online Forum</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Model Selection Dropdown */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                                    <Type className="w-4 h-4" /> AI Model
                                </label>
                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white h-12 rounded-xl">
                                        <SelectValue placeholder="Select AI Model..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                                        <SelectItem value="gpt-oss">GPT-OSS</SelectItem>
                                        <SelectItem value="gemma">Gemma</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-black font-bold text-xl h-16 rounded-2xl shadow-lg shadow-teal-500/20 transition-all group"
                                onClick={handleAnalyze}
                            >
                                <span>Analyze Content</span>
                                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

            </main>
        </div>
    );
};

export default HomePage;

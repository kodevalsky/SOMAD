import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { text, url, background, sourceCategory, selectedModel } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Define colors for specific labels
    const labelColors = {
        "True": "#22c55e", // Green-500
        "Satire/Parody": "#eab308", // Yellow-500
        "Misleading Content": "#f97316", // Orange-500
        "Imposter Content": "#ef4444", // Red-500
        "False": "#dc2626", // Red-600
        "Manipulated Content": "#b91c1c" // Red-700
    };

    useEffect(() => {
        if (!text && !url) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await fetch(`${apiUrl}/api/analyze/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                        url: url,
                        background: background,
                        sourceCategory: sourceCategory,
                        model: selectedModel
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setResult(data);
            } catch (error) {
                console.error("Error analyzing:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [text, url, background, sourceCategory, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                    <p className="text-slate-400 text-lg">Analyzing content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md border-red-900 bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            <AlertCircle className="h-6 w-6" />
                            Analysis Failed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-300">
                            An error occurred while communicating with the server.
                        </p>
                        <Alert variant="destructive" className="bg-red-950 border-red-900">
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!result) return null;

    // Check for fetch error
    if (result.fetch_error) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md border-red-900 bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            <AlertCircle className="h-6 w-6" />
                            Content Fetch Failed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-300">
                            We couldn't retrieve the content from the provided URL.
                        </p>
                        <Alert variant="destructive" className="bg-red-950 border-red-900">
                            <AlertDescription>
                                {result.fetch_error}
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Input Text manually
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Analysis Results
                        </h1>
                        <p className="text-slate-400 mt-2">AI-powered misinformation detection</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/')} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                        New Analysis
                    </Button>
                </div>

                {/* Top Row: Verdict & Confidence */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-900 border-slate-800 md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-slate-200 text-lg">Verdict</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Badge className={`text-3xl px-6 py-2 ${result.verdict === 'True' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                    result.verdict === 'False' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                                        result.verdict === 'Inconclusive' ? 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30' :
                                            'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                    }`}>
                                    {result.verdict}
                                </Badge>
                                <span className="text-slate-400 text-base">
                                    Confidence: <span className="text-white font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-slate-200 text-lg">Input Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm text-slate-400">
                            <p><span className="font-semibold text-slate-300">Source:</span> {sourceCategory || 'N/A'}</p>
                            <p><span className="font-semibold text-slate-300">Background:</span> {background || 'N/A'}</p>
                            <div className="mt-2 pt-2 border-t border-slate-800">
                                <p className="font-semibold text-slate-300 mb-1">Analyzed Content:</p>
                                <p className="line-clamp-2 italic text-slate-500 text-xs">
                                    "{result.fetched_text || text}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Row: AI Summary & Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* AI Summary */}
                    <Card className="bg-slate-900 border-slate-800 h-full">
                        <CardHeader>
                            <CardTitle className="text-slate-200 flex items-center gap-2">
                                <span className="text-blue-400">✨</span> AI Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-300 leading-relaxed prose prose-invert max-w-none text-sm">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h3 className="text-lg font-bold text-blue-300 mt-3 mb-1" {...props} />,
                                    h2: ({ node, ...props }) => <h4 className="text-base font-semibold text-blue-200 mt-2 mb-1" {...props} />,
                                    h3: ({ node, ...props }) => <h5 className="text-sm font-medium text-slate-200 mt-1 mb-1" {...props} />,
                                    strong: ({ node, ...props }) => <span className="font-bold text-white" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-0.5 my-1" {...props} />,
                                    li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-1" {...props} />,
                                }}
                            >
                                {result.summary}
                            </ReactMarkdown>
                        </CardContent>
                    </Card>

                    {/* Charts Area */}
                    <div className="space-y-6">
                        {/* Bar Chart for Labels */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-slate-200 text-lg">Model Predictions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.labels && result.labels.length > 0 ? (
                                    <>
                                        {/* Top Label */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span className="text-white">{result.labels[0]?.name || 'N/A'}</span>
                                                <span className="text-slate-400">{(result.labels[0]?.value * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${result.labels[0]?.value * 100}%`,
                                                        backgroundColor: labelColors[result.labels[0]?.name] || "#3b82f6"
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Expandable Other Labels */}
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-300">
                                                <span>Show Other Labels</span>
                                                <span className="transition group-open:rotate-180">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </span>
                                            </summary>
                                            <div className="mt-3 space-y-3 pl-2 border-l border-slate-800">
                                                {result.labels.slice(1).map((label, index) => (
                                                    <div key={index} className="space-y-1">
                                                        <div className="flex justify-between text-xs text-slate-400">
                                                            <span>{label.name}</span>
                                                            <span>{(label.value * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${label.value * 100}%`,
                                                                    backgroundColor: labelColors[label.name] || "#3b82f6"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </>
                                ) : (
                                    <p className="text-slate-500 text-sm">No label predictions available.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Radar Chart */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-slate-200 text-lg">Analysis Metrics</CardTitle>
                                <CardDescription>LLM-derived feature analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex justify-center items-center">
                                {result.radar_data && result.radar_data.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.radar_data}>
                                            <PolarGrid stroke="#334155" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Analysis"
                                                dataKey="A"
                                                stroke="#2dd4bf"
                                                strokeWidth={2}
                                                fill="#2dd4bf"
                                                fillOpacity={0.3}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                                itemStyle={{ color: '#2dd4bf' }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-slate-500 text-sm">No metrics available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;

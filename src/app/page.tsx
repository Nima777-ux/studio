
"use client"

import React, { useState, useEffect } from 'react';
import { CipherRule, applyCipher, EncryptionMode } from '@/lib/encryption-utils';
import { RuleManager } from '@/components/lexishift/rule-manager';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Repeat, Share2, SquareSlash, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Generates a default mapping for all letters: Shift +3, Output Uppercase
const generateDefaultRules = (): CipherRule[] => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  const rules: CipherRule[] = [];

  // Map lowercase to shifted uppercase
  for (let i = 0; i < lowercase.length; i++) {
    rules.push({
      original: lowercase[i],
      replacement: uppercase[(i + 3) % 26]
    });
  }

  // Map uppercase to shifted uppercase
  for (let i = 0; i < uppercase.length; i++) {
    rules.push({
      original: uppercase[i],
      replacement: uppercase[(i + 3) % 26]
    });
  }

  return rules;
};

export default function LexiShiftPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [rules, setRules] = useState<CipherRule[]>(generateDefaultRules());
  const [mode, setMode] = useState<EncryptionMode>('encrypt');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const processed = applyCipher(inputText, rules, mode);
    setOutputText(processed);
  }, [inputText, rules, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Shifted text is ready for transport.",
    });
  };

  const toggleMode = () => {
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  const clearInput = () => {
    setInputText('');
  };

  const resetRules = () => {
    setRules(generateDefaultRules());
    toast({
      title: "Protocol Reset",
      description: "Default +3 Alphabet Shift has been restored.",
    });
  };

  const clearRules = () => {
    setRules([]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 md:px-8">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      {/* Main Header */}
      <header className="mb-12 text-center space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-[0.2em] mb-4">
          <SquareSlash className="w-3 h-3" />
          CRYPTOGRAPHIC PROTOCOL
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground font-headline">
          LEXI<span className="text-primary italic">SHIFT</span>
        </h1>
        <p className="text-muted-foreground text-lg font-light tracking-wide max-w-lg mx-auto">
          Professional environment for character substitution and synthetic language architecture.
        </p>
      </header>

      {/* Main Grid Content */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Left Column: Management */}
        <div className="lg:col-span-4 space-y-6">
          <RuleManager rules={rules} onRulesChange={setRules} />
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetRules} className="flex-1 gap-2 border-primary/20 hover:bg-primary/10">
              <RotateCcw className="w-3 h-3" />
              Reset to Default
            </Button>
            <Button variant="outline" size="sm" onClick={clearRules} className="flex-1 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
              <Trash2 className="w-3 h-3" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Right Column: Interactive Engine */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-card/30 backdrop-blur-xl border-primary/30 shadow-2xl overflow-hidden">
            <div className="h-1 bg-primary/40 w-full" />
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-border/50">
                {/* Input Area */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-primary uppercase">Source Terminal</span>
                    <Button variant="ghost" size="icon" onClick={clearInput} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter raw frequency data..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[250px] bg-transparent border-none text-xl font-mono focus-visible:ring-0 placeholder:text-muted-foreground/30 resize-none"
                  />
                  <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-muted/50 border border-border">{inputText.length} CHARS</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted/50 border border-border">{inputText.split(/\s+/).filter(Boolean).length} WORDS</span>
                  </div>
                </div>

                {/* Output Area */}
                <div className="p-6 space-y-4 bg-primary/5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-accent uppercase">Shifted Result</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6 text-accent">
                        {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-accent">
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="min-h-[250px] font-mono text-xl text-accent break-words whitespace-pre-wrap selection:bg-accent selection:text-accent-foreground">
                    {outputText || <span className="opacity-20 italic">Awaiting transmission...</span>}
                  </div>
                  
                  {/* Decorative Scan Line */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 opacity-30 bg-[length:100%_4px,3px_100%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border border-border">
                  <span className={`text-xs font-bold ${mode === 'encrypt' ? 'text-primary' : 'text-muted-foreground'}`}>ENCRYPT</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={toggleMode}
                    className="h-8 w-12 rounded-full bg-muted/50 p-0 overflow-hidden relative"
                  >
                    <div className={`absolute inset-0 bg-primary/20 transition-transform ${mode === 'encrypt' ? '-translate-x-full' : 'translate-x-full'}`} />
                    <Repeat className={`w-4 h-4 text-primary transition-transform duration-500 ${mode === 'decrypt' ? 'rotate-180' : ''}`} />
                  </Button>
                  <span className={`text-xs font-bold ${mode === 'decrypt' ? 'text-primary' : 'text-muted-foreground'}`}>DECRYPT</span>
               </div>
               <div className="hidden md:block h-8 w-px bg-border" />
               <p className="text-xs text-muted-foreground hidden md:block font-mono">
                 MODE: {mode.toUpperCase()}
               </p>
            </div>
            
            <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/80 font-bold px-8">
              EXPORT PROTOCOL
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-border/20 w-full max-w-6xl text-center space-y-4">
        <p className="text-muted-foreground text-xs tracking-[0.3em]">LEXISHIFT v2.4.0 // END-TO-END SUBSTITUTION ENGINE</p>
        <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="h-4 w-4 rounded-full bg-primary" />
           <div className="h-4 w-4 rounded-full bg-secondary" />
           <div className="h-4 w-4 rounded-full bg-accent" />
        </div>
      </footer>
    </div>
  );
}

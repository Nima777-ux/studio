"use client"

import React, { useState } from 'react';
import { generateThemeBasedEncryptionScheme } from '@/ai/flows/generate-theme-based-encryption-scheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CipherRule } from '@/lib/encryption-utils';
import { useToast } from '@/hooks/use-toast';

interface AIGeneratorPanelProps {
  onSchemeGenerated: (rules: CipherRule[]) => void;
}

export function AIGeneratorPanel({ onSchemeGenerated }: AIGeneratorPanelProps) {
  const [theme, setTheme] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme) return;
    setIsLoading(true);
    setIsGlitching(true);
    try {
      const result = await generateThemeBasedEncryptionScheme({ theme, complexity });
      onSchemeGenerated(result.rules);
      toast({
        title: "Protocol Synthesized",
        description: `Successfully generated ${result.rules.length} encryption rules based on "${theme}".`,
      });
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      toast({
        variant: "destructive",
        title: "Synthesis Error",
        description: error.message || "The AI architect failed to construct the scheme. Check your connection or API configuration.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsGlitching(false), 800);
    }
  };

  return (
    <Card className={`bg-card/40 backdrop-blur-md border-primary/20 overflow-hidden relative ${isGlitching ? 'animate-glitch-fast' : ''}`}>
      {isLoading && <div className="absolute inset-0 bg-primary/5 scanline" />}
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AI Language Architect
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Theme Concept</label>
          <Input
            placeholder="e.g. Alien hieroglyphs, Cyberpunk, Victorian"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-background/20 border-primary/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Complexity Level</label>
          <Select value={complexity} onValueChange={(val: any) => setComplexity(val)}>
            <SelectTrigger className="bg-background/20 border-primary/20">
              <SelectValue placeholder="Select complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple Substitutions</SelectItem>
              <SelectItem value="medium">Medium Complexity</SelectItem>
              <SelectItem value="complex">High Complexity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !theme} 
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold group"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              CONSTRUCTING SCHEME...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
              GENERATE KEY
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

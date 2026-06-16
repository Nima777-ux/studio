"use client"

import React, { useState } from 'react';
import { CipherRule } from '@/lib/encryption-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Settings2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RuleManagerProps {
  rules: CipherRule[];
  onRulesChange: (rules: CipherRule[]) => void;
}

export function RuleManager({ rules, onRulesChange }: RuleManagerProps) {
  const [newOriginal, setNewOriginal] = useState('');
  const [newReplacement, setNewReplacement] = useState('');

  const addRule = () => {
    if (newOriginal && newReplacement) {
      // Check if original already exists
      if (rules.some(r => r.original === newOriginal)) {
        // Just update existing? Or toast error?
        onRulesChange(rules.map(r => r.original === newOriginal ? { original: newOriginal, replacement: newReplacement } : r));
      } else {
        onRulesChange([...rules, { original: newOriginal, replacement: newReplacement }]);
      }
      setNewOriginal('');
      setNewReplacement('');
    }
  };

  const removeRule = (original: string) => {
    onRulesChange(rules.filter(r => r.original !== original));
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Substitution Engine
          </CardTitle>
          <CardDescription className="text-xs">Define your translation mapping rules.</CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Mapping "A" to "C" will replace every "A" with "C". Multi-character words are supported.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <Input
              placeholder="Original (e.g. A)"
              value={newOriginal}
              onChange={(e) => setNewOriginal(e.target.value)}
              className="bg-background/30 border-primary/20 focus:border-primary"
            />
          </div>
          <div className="text-primary font-bold">→</div>
          <div className="flex-1 space-y-1">
            <Input
              placeholder="Target (e.g. C)"
              value={newReplacement}
              onChange={(e) => setNewReplacement(e.target.value)}
              className="bg-background/30 border-primary/20 focus:border-primary"
            />
          </div>
          <Button size="icon" variant="outline" onClick={addRule} className="shrink-0 hover:bg-primary/20">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {rules.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm italic">
              No rules defined yet. Add one above!
            </div>
          ) : (
            rules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono bg-primary/10 px-2 py-0.5 rounded text-primary">{rule.original}</span>
                  <span className="text-muted-foreground">maps to</span>
                  <span className="font-mono bg-accent/10 px-2 py-0.5 rounded text-accent">{rule.replacement}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeRule(rule.original)}
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

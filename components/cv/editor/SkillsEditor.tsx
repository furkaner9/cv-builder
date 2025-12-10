"use client";

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Code, Plus, Trash2, Star } from 'lucide-react';
import type { Skill, SkillLevel, SkillCategory } from '@/types/cv';

const generateId = () => Math.random().toString(36).substr(2, 9);

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
  expert: 'Uzman',
};

const categoryLabels: Record<SkillCategory, string> = {
  technical: 'Teknik',
  soft: 'Kişisel',
  language: 'Dil',
  tool: 'Araç',
  framework: 'Framework',
};

export function SkillsEditor() {
  const { currentCV, addSkill, updateSkill, deleteSkill } = useCVStore();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('technical');

  if (!currentCV) return null;

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: generateId(),
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: newSkillCategory,
      };
      addSkill(newSkill);
      setNewSkillName('');
    }
  };

  const groupedSkills = currentCV.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  const getStarCount = (level: SkillLevel): number => {
    const levels: Record<SkillLevel, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };
    return levels[level];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Yetenekler
          </CardTitle>
          <CardDescription>
            Teknik ve kişisel yeteneklerinizi ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <Label htmlFor="skillName">Yetenek Adı</Label>
                <Input
                  id="skillName"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="JavaScript, React, Takım Çalışması..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill();
                    }
                  }}
                />
              </div>

              <div className="md:col-span-3">
                <Label htmlFor="skillLevel">Seviye</Label>
                <Select
                  value={newSkillLevel}
                  onValueChange={(value) => setNewSkillLevel(value as SkillLevel)}
                >
                  <SelectTrigger id="skillLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(levelLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3">
                <Label htmlFor="skillCategory">Kategori</Label>
                <Select
                  value={newSkillCategory}
                  onValueChange={(value) => setNewSkillCategory(value as SkillCategory)}
                >
                  <SelectTrigger id="skillCategory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button onClick={handleAddSkill} className="w-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentCV.skills.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz yetenek eklenmedi
              </h3>
              <p className="text-gray-600 mb-6">
                Yukarıdaki formu kullanarak yeteneklerinizi ekleyin
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-base">
                  {categoryLabels[category as SkillCategory]}
                </CardTitle>
                <CardDescription>
                  {skills.length} yetenek
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {levelLabels[skill.level]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < getStarCount(skill.level)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={skill.level}
                          onValueChange={(value) =>
                            updateSkill(skill.id, { level: value as SkillLevel })
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(levelLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSkill(skill.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
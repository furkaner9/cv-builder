"use client";

import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderGit2, Plus, Trash2, X } from 'lucide-react';
import type { Project } from '@/types/cv';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function ProjectsEditor() {
  const { currentCV, addProject, updateProject, deleteProject } = useCVStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentCV) return null;

  const handleAddProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      role: '',
      url: '',
      github: '',
      technologies: [],
      highlights: [],
      current: false,
    };
    addProject(newProject);
    setExpandedId(newProject.id);
  };

  const handleAddTechnology = (projectId: string, tech: string) => {
    const project = currentCV.projects.find((p) => p.id === projectId);
    if (project && tech.trim()) {
      updateProject(projectId, {
        technologies: [...project.technologies, tech.trim()],
      });
    }
  };

  const handleRemoveTechnology = (projectId: string, index: number) => {
    const project = currentCV.projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        technologies: project.technologies.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5" />
            Projeler
          </CardTitle>
          <CardDescription>
            Kişisel veya profesyonel projelerinizi ekleyin
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCV.projects.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FolderGit2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz proje eklenmedi
              </h3>
              <p className="text-gray-600 mb-6">
                İlk projenizi ekleyerek başlayın
              </p>
              <Button onClick={handleAddProject}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Projeyi Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {currentCV.projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {project.name || 'Yeni Proje'}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                    >
                      {expandedId === project.id ? 'Kapat' : 'Düzenle'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
                          deleteProject(project.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === project.id && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`name-${project.id}`}>
                        Proje Adı <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`name-${project.id}`}
                        value={project.name}
                        onChange={(e) => updateProject(project.id, { name: e.target.value })}
                        placeholder="E-Ticaret Platformu"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`role-${project.id}`}>Rol</Label>
                      <Input
                        id={`role-${project.id}`}
                        value={project.role || ''}
                        onChange={(e) => updateProject(project.id, { role: e.target.value })}
                        placeholder="Full Stack Developer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`url-${project.id}`}>Proje URL'si</Label>
                      <Input
                        id={`url-${project.id}`}
                        type="url"
                        value={project.url || ''}
                        onChange={(e) => updateProject(project.id, { url: e.target.value })}
                        placeholder="https://proje.com"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`github-${project.id}`}>GitHub Repository</Label>
                      <Input
                        id={`github-${project.id}`}
                        type="url"
                        value={project.github || ''}
                        onChange={(e) => updateProject(project.id, { github: e.target.value })}
                        placeholder="https://github.com/kullanici/proje"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`description-${project.id}`}>
                        Açıklama <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`description-${project.id}`}
                        value={project.description}
                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                        placeholder="Projenin amacını ve özelliklerini açıklayın..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Teknolojiler */}
                  <div className="space-y-3">
                    <Label>Kullanılan Teknolojiler</Label>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tech}
                          <button
                            onClick={() => handleRemoveTechnology(project.id, index)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <Input
                        placeholder="Teknoloji ekle (Enter ile)"
                        className="w-40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleAddTechnology(project.id, input.value);
                            input.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <Button onClick={handleAddProject} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Proje Ekle
          </Button>
        </>
      )}
    </div>
  );
}
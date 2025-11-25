'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { PencilIcon, DocumentTextIcon, EnvelopeIcon, BookOpenIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { ContextData } from '@/types/audit';

const exampleDesigns = [
  { icon: PencilIcon, name: 'Jasper Clone', type: 'AI Writer' },
  { icon: DocumentTextIcon, name: 'Copy.ai Style', type: 'Marketing Copy' },
  { icon: EnvelopeIcon, name: 'Email Generator', type: 'Outreach AI' },
  { icon: BookOpenIcon, name: 'Blog Writer', type: 'Long-form AI' },
];

export default function UploadPage() {
  const router = useRouter();
  const [context, setContext] = useState<ContextData | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const savedContext = sessionStorage.getItem('auditContext');
    if (savedContext) {
      setContext(JSON.parse(savedContext));
    } else {
      router.push('/audit/context');
    }
  }, [router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      sessionStorage.setItem('auditImage', base64);
      router.push('/audit/analyze');
    };
    reader.readAsDataURL(file);
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const getInterfaceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      chatbot: 'Chatbot/Conversational',
      content: 'Content Generator',
      code: 'Code Assistant',
      image: 'Image/Creative AI',
      analytics: 'Analytics/Insights',
      other: 'AI Interface',
    };
    return labels[type] || type;
  };

  if (!context) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-primary py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center mb-12">
          <div className="flex-1 h-1 bg-text-primary rounded-full" />
          <div className="mx-3 text-xs text-text-primary">✓ Context</div>
          <div className="flex-1 h-1 bg-black dark:bg-white rounded-full" />
          <div className="mx-3 text-xs font-semibold text-text-primary">STEP 2</div>
          <div className="flex-1 h-1 bg-border-primary rounded-full" />
        </div>

        {/* Context Summary */}
        <div className="mb-8 p-4 bg-background-secondary rounded-2xl border-2 border-border-primary">
          <div className="font-semibold mb-2 text-text-primary">
            🎯 Analyzing for: {getInterfaceTypeLabel(context.interfaceType)}
          </div>
          <div className="text-sm text-text-secondary">
            Focus: {context.mainConcern ? context.mainConcern.replace('-', ' ') : 'General analysis'} •
            Specific patterns for AI transparency
          </div>
          <Link href="/audit/context" className="text-xs text-text-tertiary hover:text-text-secondary underline">
            Edit context
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold mb-4 text-text-primary tracking-tight">Now, upload your design</h1>
          <p className="text-lg text-text-secondary">
            We'll check for patterns specific to {getInterfaceTypeLabel(context.interfaceType).toLowerCase()}
          </p>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-3 border-dashed rounded-2xl p-16 mb-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-black dark:border-white bg-accent-subtle'
              : 'border-border-primary bg-background-secondary hover:border-border-secondary hover:bg-accent-subtle'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 mx-auto mb-4 text-text-primary">
            <ArrowUpTrayIcon className="w-full h-full" />
          </div>
          <div className="text-xl font-semibold mb-2 text-text-primary">
            {isDragActive ? 'Drop your design here' : 'Drop your design here'}
          </div>
          <div className="text-sm text-text-tertiary">
            or click to browse • PNG, JPG, or WebP • Max 10MB
          </div>
          {uploading && (
            <div className="mt-4 text-text-primary font-semibold">
              Processing image...
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="text-center mb-8">
          <div className="text-text-tertiary mb-6">
            — or try an example {getInterfaceTypeLabel(context.interfaceType).toLowerCase()} —
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exampleDesigns.map((design, index) => {
              const Icon = design.icon;
              return (
                <div
                  key={index}
                  className="border-2 border-border-primary rounded-2xl p-4 cursor-pointer hover:border-border-secondary hover:-translate-y-1 transition-all text-center shadow-subtle hover:shadow-card"
                >
                  <div className="w-12 h-12 mx-auto mb-3 text-text-primary">
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="font-semibold text-sm mb-1 text-text-primary">{design.name}</div>
                  <div className="text-xs text-text-tertiary">{design.type}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/audit/context"
            className="inline-block px-6 py-3 border-2 border-border-primary rounded-2xl font-semibold text-text-primary hover:border-border-secondary transition-colors"
          >
            ← Back to Context
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { CreateProjectForm } from '@/components/create-project-form';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/projects');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
        <main className="px-4 pt-6">
          <div className="max-w-2xl mx-auto">
            <CreateProjectForm
              onSuccess={handleSuccess}
              onCancel={() => router.push('/projects')}
            />
          </div>
        </main>
      </div>
    );
  }


import React, { useState } from 'react';
import { HomePage } from './views/HomePage';
import { EditorPage } from './views/EditorPage';
import { DocsPage } from './views/DocsPage';
type AppRoute =
  | { page: 'home' }
  | { page: 'editor'; projectId: string }
  | { page: 'docs' };
export const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>({ page: 'home' });
  if (route.page === 'editor') {
    return (
      <EditorPage
        projectId={route.projectId}
        onBack={() => setRoute({ page: 'home' })}
      />
    );
  }
  if (route.page === 'docs') {
    return <DocsPage onBack={() => setRoute({ page: 'home' })} />;
  }
  return (
    <HomePage
      onOpenProject={(id) => setRoute({ page: 'editor', projectId: id })}
      onOpenDocs={() => setRoute({ page: 'docs' })}
    />
  );
};

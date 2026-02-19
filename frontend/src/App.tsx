import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { NotFound } from './pages/NotFound';
import { SearchPage } from './pages/SearchPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryProductsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

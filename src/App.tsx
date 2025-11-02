import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { EditorProvider } from "./contexts/EditorContext";
import { EditorLoginDialog } from "./components/EditorLoginDialog";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import Archive from "./pages/Archive";
import Post from "./pages/Post";
import Subscribe from "./pages/Subscribe";
import Newsletter from "./pages/Newsletter";
import NewsletterNew from "./pages/NewsletterNew";
import NewsletterEdit from "./pages/NewsletterEdit";
import MillionSlots from "./pages/MillionSlots";
import Contribute from "./pages/Contribute";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Resources from "./pages/Resources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EditorProvider>
        <Toaster />
        <Sonner />
        <EditorLoginDialog />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/newsletter/new" element={<NewsletterNew />} />
              <Route path="/newsletter/:id/edit" element={<NewsletterEdit />} />
              <Route path="/million-slots" element={<MillionSlots />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </EditorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

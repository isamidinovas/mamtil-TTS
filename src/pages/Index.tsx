import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TTSForm from "@/components/TTSForm";

const Index = () => {
  return (
    <div className="bg-gradient-animation flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-black to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent blur-3xl" />

        <div className="max-w-3xl mx-auto text-center mb-10 relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Текстти үнгө айландыруу
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Төмөндө текстти киргизиңиз, үндү тандаңыз жана анын жандануусун
            угуңуз. Контент, жеткиликтүүлүк же жөн гана көңүл ачуу үчүн табигый
            үн түзүңүз!
          </p>
        </div>

        <TTSForm />

        <div className="mt-16 max-w-xl mx-auto text-center relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
          <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">
            Бул кандайча иштейт
          </h3>
          <ol className="text-white/80 space-y-4 text-left list-none">
            {[
              "Текстти киргизүү талаасына текст жазыңыз же коюңуз",
              "Эркек же аял үнүн тандаңыз",
              'Текстти угуу үчүн "Үн чыгаруу" баскычын басыңыз',
              "Тыныгуу, улантуу же токтотуу үчүн башкаруу баскычтарын колдонуңуз",
            ].map((step, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10"
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold">
                  {index + 1}
                </span>
                <span className="text-lg">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

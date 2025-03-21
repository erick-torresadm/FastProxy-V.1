import React from 'react';
import { Book, PlayCircle, CheckCircle, Coffee, Settings, Shield, Globe, Terminal } from 'lucide-react';

export default function Tutorials() {
  const tutorials = [
    {
      title: 'Introdução aos Proxies',
      description: 'Aprenda os conceitos básicos de proxies e como eles funcionam.',
      icon: Book,
      duration: '5 min',
      level: 'Iniciante',
      videoUrl: '#',
    },
    {
      title: 'Configurando seu Primeiro Proxy',
      description: 'Guia passo a passo para configurar e começar a usar seu proxy.',
      icon: Settings,
      duration: '10 min',
      level: 'Iniciante',
      videoUrl: '#',
    },
    {
      title: 'Segurança e Privacidade',
      description: 'Melhores práticas para manter seus proxies seguros.',
      icon: Shield,
      duration: '8 min',
      level: 'Intermediário',
      videoUrl: '#',
    },
    {
      title: 'Navegação Anônima',
      description: 'Como usar proxies para navegação anônima e segura.',
      icon: Globe,
      duration: '12 min',
      level: 'Intermediário',
      videoUrl: '#',
    },
    {
      title: 'Configurações Avançadas',
      description: 'Explore configurações avançadas e otimizações de proxy.',
      icon: Terminal,
      duration: '15 min',
      level: 'Avançado',
      videoUrl: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <PlayCircle className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Tutoriais Fast Proxy
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Aprenda a utilizar nossos proxies de forma eficiente e segura
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial, index) => {
            const Icon = tutorial.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tutorial.level === 'Iniciante' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : tutorial.level === 'Intermediário'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {tutorial.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 mb-4">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 dark:text-gray-500">
                      <Coffee className="h-5 w-5 mr-2" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <a
                      href={tutorial.videoUrl}
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <span className="mr-2">Assistir</span>
                      <PlayCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>4.8/5 avaliação dos usuários</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Precisa de ajuda adicional?
            </h3>
            <p className="text-gray-500 dark:text-gray-300 mb-6">
              Nossa equipe de suporte está sempre disponível para ajudar você com qualquer dúvida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/support"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Contatar Suporte
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Ver documentação
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
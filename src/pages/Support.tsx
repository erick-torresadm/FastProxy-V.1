import React from 'react';
import { HeadphonesIcon, MessageCircle, Mail, Clock, Phone } from 'lucide-react';

export default function Support() {
  const whatsappNumber = '5511930070320';
  const whatsappMessage = encodeURIComponent('Olá! Preciso de ajuda com o Fast Proxy.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <HeadphonesIcon className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Suporte Fast Proxy
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Estamos aqui para ajudar! Entre em contato conosco.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* WhatsApp Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      WhatsApp
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      Atendimento rápido e direto
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Iniciar Conversa
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Mail className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      suporte@fastproxy.com.br
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="mailto:suporte@fastproxy.com.br"
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Enviar Email
                  </a>
                </div>
              </div>
            </div>

            {/* Horário Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Horário de Atendimento
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      Segunda a Sexta: 9h às 18h
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full px-4 py-3 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
                    <Phone className="inline-block h-5 w-5 mr-2" />
                    (11) 93007-0320
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Perguntas Frequentes
            </h3>
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Como funciona o proxy?
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Nossos proxies são configurados para fornecer conexões seguras e estáveis, permitindo acesso a conteúdo de forma anônima e eficiente.
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Quanto tempo leva para ativar?
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  A ativação é instantânea após a confirmação do pagamento. Você receberá as credenciais por email.
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Como renovar meu proxy?
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Você pode renovar seu proxy através do painel do cliente ou entrando em contato com nosso suporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
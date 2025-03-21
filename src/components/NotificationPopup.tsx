import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Tag, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'update' | 'promo';
  title: string;
  description: string;
  date: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'update',
    title: 'Nova Atualização: Melhor Desempenho',
    description: 'Atualizamos nossa infraestrutura para oferecer velocidades ainda maiores nos proxies.',
    date: '2025-03-21'
  },
  {
    id: '2',
    type: 'promo',
    title: 'Promoção Especial: 30% OFF',
    description: 'Aproveite 30% de desconto na compra de novos proxies. Válido por tempo limitado!',
    date: '2025-03-21'
  }
];

export function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const lastShown = localStorage.getItem('lastNotificationShown');
    const now = new Date().getTime();

    if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setIsOpen(true);
      localStorage.setItem('lastNotificationShown', now.toString());
    }
  }, []);

  if (!currentNotification) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {currentNotification.type === 'update' ? (
                  <Bell className="h-6 w-6 text-blue-500" />
                ) : (
                  <Tag className="h-6 w-6 text-green-500" />
                )}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentNotification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentNotification.description}
                </p>
                {currentNotification.type === 'promo' && (
                  <div className="mt-3">
                    <a
                      href="#"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Aproveitar Agora
                    </a>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Fechar</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
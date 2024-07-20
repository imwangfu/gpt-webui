import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@icon/PersonIcon';
import ApiMenu from '@components/ApiMenu';
import useStore from '@store/store';

const Config = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const firstVisit = useStore((state) => state.firstVisit);
  const setFirstVisit = useStore((state) => state.setFirstVisit);

  useEffect(() => {
    const storedFirstVisit = localStorage.getItem('firstVisit');
    if (storedFirstVisit === null) {
      setIsModalOpen(true);
      setFirstVisit(true);
      localStorage.setItem('firstVisit', 'false');
    } else {
      setFirstVisit(false);
    }
  }, [setFirstVisit]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFirstVisit(false);
  };

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        id='api-menu'
        onClick={() => setIsModalOpen(true)}
      >
        <PersonIcon />
        {t('api')}
      </a>
      {isModalOpen && <ApiMenu setIsModalOpen={handleModalClose} />}
    </>
  );
};

export default Config;

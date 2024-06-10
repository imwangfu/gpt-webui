import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import { ConfigInterface, ModelOptions } from '@type/chat';
import DownChevronArrow from '@icon/DownChevronArrow';
import { modelMaxToken, modelOptions } from '@constants/chat';
import { Switch } from 'antd';
import { t } from 'i18next';
const ConfigMenu = ({
  setIsModalOpen,
  config,
  setConfig,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  config: ConfigInterface;
  setConfig: (config: ConfigInterface) => void;
}) => {
  const [_maxToken, _setMaxToken] = useState<any>(config.max_tokens);
  const [_model, _setModel] = useState<any>(config.model);
  const [isStreaming, setIsStreaming] = useState<boolean>(config.stream);
  const [_temperature, _setTemperature] = useState<any>(config.temperature);
  const [_presencePenalty, _setPresencePenalty] = useState<any>(config.presence_penalty);
  const [_topP, _setTopP] = useState<any>(config.top_p);
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<any>(config.frequency_penalty);
  const [enableTemperature, setEnableTemperature] = useState<boolean>(true);
  const [enableTopP, setEnableTopP] = useState<boolean>(true);
  const [enablePresencePenalty, setEnablePresencePenalty] = useState<boolean>(true);
  const [enableFrequencyPenalty, setEnableFrequencyPenalty] = useState<boolean>(true);
  const [enableMaxToken, setEnableMaxToken] = useState<boolean>(true);
  const { t } = useTranslation('model');
  const handleConfirm = () => {
    setConfig({
      max_tokens: enableMaxToken ? _maxToken : null,
      model: _model,
      temperature: enableTemperature ? _temperature : null,
      presence_penalty: enablePresencePenalty ? _presencePenalty : null,
      top_p: enableTopP ? _topP : null,
      stream: isStreaming,
      frequency_penalty: enableFrequencyPenalty ? _frequencyPenalty : null,
    });
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title={t('configuration') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleConfirm}
      handleClickBackdrop={handleConfirm}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <ModelSelector _model={_model} _setModel={_setModel} />
        <StreamingSelector isStreaming={isStreaming} setIsStreaming={setIsStreaming} />
        <MaxTokenSlider
          _maxToken={_maxToken}
          _setMaxToken={_setMaxToken}
          enableMaxToken={enableMaxToken}
          setEnableMaxToken={setEnableMaxToken}
          _model={_model}
        />
        <TemperatureSlider
          _temperature={_temperature}
          _setTemperature={_setTemperature}
          enableTemperature={enableTemperature}
          setEnableTemperature={setEnableTemperature}
        />
        <TopPSlider
          _topP={_topP}
          _setTopP={_setTopP}
          enableTopP={enableTopP}
          setEnableTopP={setEnableTopP}
        />
        <PresencePenaltySlider
          _presencePenalty={_presencePenalty}
          _setPresencePenalty={_setPresencePenalty}
          enablePresencePenalty={enablePresencePenalty}
          setEnablePresencePenalty={setEnablePresencePenalty}
        />
        <FrequencyPenaltySlider
          _frequencyPenalty={_frequencyPenalty}
          _setFrequencyPenalty={_setFrequencyPenalty}
          enableFrequencyPenalty={enableFrequencyPenalty}
          setEnableFrequencyPenalty={setEnableFrequencyPenalty}
        />
      </div>
    </PopupModal>
  );
};

export const StreamingSelector = ({
  isStreaming,
  setIsStreaming,
}: {
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <div className='mb-4'>
      <label htmlFor='streamingSwitch' className='flex items-center cursor-pointer'>
        <span className='text-white'>流式：</span>
        <div className='relative'>
          <input
            id='streamingSwitch'
            type='checkbox'
            className='sr-only'
            checked={isStreaming}
            onChange={toggleStreaming}
          />
          <div
            className={`block w-14 h-8 rounded-full transition-colors ${
              isStreaming ? 'bg-green-500' : 'bg-gray-600'
            }`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform transform ${
              isStreaming ? 'translate-x-full bg-white' : 'bg-white'
            }`}
          ></div>
        </div>
        <div className='ml-3 text-gray-700 font-medium'>
          {isStreaming ? 'Streaming Enabled' : 'Streaming Disabled'}
        </div>
      </label>
    </div>
  );
};

export const ModelSelector = ({
  _model,
  _setModel,
}: {
  _model: string;
  _setModel: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [inputModel, setInputModel] = useState<string>('');

  const handleSelectModel = (m: string) => {
    _setModel(m);
    setDropDown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputModel(e.target.value);
  };

  const handleInputConfirm = () => {
    _setModel(inputModel);
    setDropDown(false);
  };

  return (
    <div className='mb-4 flex items-center'>
      <div>
        <button
          className='btn btn-neutral btn-small flex gap-1'
          type='button'
          onClick={() => setDropDown(prev => !prev)}
          aria-label='model'
        >
          {_model}
          <DownChevronArrow />
        </button>
        {dropDown && (
          <div
            id='dropdown'
            className='absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90'
          >
            <ul
              className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
              aria-labelledby='dropdownDefaultButton'
            >
              {modelOptions.map((m) => (
                <li
                  className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
                  onClick={() => handleSelectModel(m)}
                  key={m}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='flex-grow ml-2'>
        <input
          type='text'
          value={inputModel}
          onChange={handleInputChange}
          className='px-4 py-2 w-full bg-gray-600 text-sm text-white'
          placeholder={t('custom model name, type Enter key ...') as string}
          onKeyDown={(e) => e.key === 'Enter' && handleInputConfirm()}
        />
      </div>
    </div>
  );
};

export const MaxTokenSlider = ({
  _maxToken,
  _setMaxToken,
  _model,
  enableMaxToken,
  setEnableMaxToken,
}: {
  _maxToken: number | null;
  _setMaxToken: React.Dispatch<React.SetStateAction<number | null>>;
  _model: string;
  enableMaxToken?: boolean;
  setEnableMaxToken?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation('model');
  const inputRef = useRef<HTMLInputElement>(null);
  const [localMaxToken, setLocalMaxToken] = useState(4096)

  useEffect(() => {
    if (_maxToken !== null) {
      setLocalMaxToken(_maxToken);
      setEnableMaxToken && setEnableMaxToken(true);
    } else {
      setEnableMaxToken && setEnableMaxToken(false);
    }
  }, [_maxToken]);

  const handleSliderChange = (value: number) => {
    setLocalMaxToken(value);
    _setMaxToken(value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setEnableMaxToken && setEnableMaxToken(checked);
    if (checked) {
      _setMaxToken(localMaxToken);
    } else {
      _setMaxToken(null);
    }
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      _setMaxToken(Number(inputRef.current.value));
    }
  }, [_model]);

  return (
    <div>
      <label className='block text-sm font-medium text-gray-900 dark:text-white'>
        {t('token.label')}: {enableMaxToken ? localMaxToken : 'N/A'}
      </label>
      <Switch
        checked={enableMaxToken}
        onChange={handleSwitchChange}
        className='mb-2'
      />
      <input
        type='range'
        ref={inputRef}
        value={enableMaxToken ? localMaxToken as any : 0}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
        min={0}
        max={modelMaxToken[_model] || 4096}
        step={1}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        disabled={!enableMaxToken}
      />
      <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
        {t('token.description')}
      </div>
    </div>
  );
};

export const TemperatureSlider = ({
  _temperature,
  _setTemperature,
  enableTemperature,
  setEnableTemperature,
}: {
  _temperature: number | null;
  _setTemperature: React.Dispatch<React.SetStateAction<number | null>>;
  enableTemperature?: boolean;
  setEnableTemperature?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation('model');
  const [localTemperature, setLocalTemperature] = useState<number>(1.0);

  useEffect(() => {
    if (_temperature !== null) {
      setLocalTemperature(_temperature);
      setEnableTemperature && setEnableTemperature(true);
    } else {
      setEnableTemperature && setEnableTemperature(false);
    }
  }, [_temperature]);

  const handleSliderChange = (value: number) => {
    setLocalTemperature(value);
    _setTemperature(value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setEnableTemperature && setEnableTemperature(checked);
    if (checked) {
      _setTemperature(localTemperature);
    } else {
      _setTemperature(null);
    }
  };

  return (
    <div className='mt-5 pt-5 border-t border-gray-500'>
      <label className='block text-sm font-medium text-gray-900 dark:text-white'>
        {t('temperature.label')}: {enableTemperature ? localTemperature : 'N/A'}
      </label>
      <Switch
        checked={enableTemperature}
        onChange={handleSwitchChange}
        className='mb-2'
      />
      <input
        id='default-range'
        type='range'
        value={enableTemperature ? localTemperature : 0}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
        min={0}
        max={2}
        step={0.1}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        disabled={!enableTemperature}
      />
      <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
        {t('temperature.description')}
      </div>
    </div>
  );
};


export const TopPSlider = ({
  _topP,
  _setTopP,
  enableTopP,
  setEnableTopP,
}: {
  _topP: number | null;
  _setTopP: React.Dispatch<React.SetStateAction<number | null>>;
  enableTopP?: boolean;
  setEnableTopP?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation('model');
  const [localTopP, setLocalTopP] = useState<number>(0.9);

  useEffect(() => {
    if (_topP !== null) {
      setLocalTopP(_topP);
      setEnableTopP && setEnableTopP(true);
    } else {
      setEnableTopP && setEnableTopP(false);
    }
  }, [_topP]);

  const handleSliderChange = (value: number) => {
    setLocalTopP(value);
    _setTopP(value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setEnableTopP && setEnableTopP(checked);
    if (checked) {
      _setTopP(localTopP);
    } else {
      _setTopP(null);
    }
  };

  return (
    <div className='mt-5 pt-5 border-t border-gray-500'>
      <label className='block text-sm font-medium text-gray-900 dark:text-white'>
        {t('topP.label')}: {enableTopP ? localTopP : 'N/A'}
      </label>
      <Switch
        checked={enableTopP}
        onChange={handleSwitchChange}
        className='mb-2'
      />
      <input
        id='default-range'
        type='range'
        value={enableTopP ? localTopP : 0}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
        min={0}
        max={1}
        step={0.05}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        disabled={!enableTopP}
      />
      <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
        {t('topP.description')}
      </div>
    </div>
  );
};

export const PresencePenaltySlider = ({
  _presencePenalty,
  _setPresencePenalty,
  enablePresencePenalty,
  setEnablePresencePenalty,
}: {
  _presencePenalty: number | null;
  _setPresencePenalty: React.Dispatch<React.SetStateAction<number | null>>;
  enablePresencePenalty?: boolean;
  setEnablePresencePenalty?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation('model');
  const [localPresencePenalty, setLocalPresencePenalty] = useState<number>(0.0);

  useEffect(() => {
    if (_presencePenalty !== null) {
      setLocalPresencePenalty(_presencePenalty);
      setEnablePresencePenalty && setEnablePresencePenalty(true);
    } else {
      setEnablePresencePenalty && setEnablePresencePenalty(false);
    }
  }, [_presencePenalty]);

  const handleSliderChange = (value: number) => {
    setLocalPresencePenalty(value);
    _setPresencePenalty(value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setEnablePresencePenalty && setEnablePresencePenalty(checked);
    if (checked) {
      _setPresencePenalty(localPresencePenalty);
    } else {
      _setPresencePenalty(null);
    }
  };

  return (
    <div className='mt-5 pt-5 border-t border-gray-500'>
      <label className='block text-sm font-medium text-gray-900 dark:text-white'>
        {t('presencePenalty.label')}: {enablePresencePenalty ? localPresencePenalty : 'N/A'}
      </label>
      <Switch
        checked={enablePresencePenalty}
        onChange={handleSwitchChange}
        className='mb-2'
      />
      <input
        id='default-range'
        type='range'
        value={enablePresencePenalty ? localPresencePenalty : 0}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
        min={-2}
        max={2}
        step={0.1}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        disabled={!enablePresencePenalty}
      />
      <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
        {t('presencePenalty.description')}
      </div>
    </div>
  );
};


export const FrequencyPenaltySlider = ({
  _frequencyPenalty,
  _setFrequencyPenalty,
  enableFrequencyPenalty,
  setEnableFrequencyPenalty,
}: {
  _frequencyPenalty: number | null;
  _setFrequencyPenalty: React.Dispatch<React.SetStateAction<number | null>>;
  enableFrequencyPenalty?: boolean;
  setEnableFrequencyPenalty?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation('model');
  const [localFrequencyPenalty, setLocalFrequencyPenalty] = useState<number>(0.0);

  useEffect(() => {
    if (_frequencyPenalty !== null) {
      setLocalFrequencyPenalty(_frequencyPenalty);
      setEnableFrequencyPenalty && setEnableFrequencyPenalty(true);
    } else {
      setEnableFrequencyPenalty && setEnableFrequencyPenalty(false);
    }
  }, [_frequencyPenalty]);

  const handleSliderChange = (value: number) => {
    setLocalFrequencyPenalty(value);
    _setFrequencyPenalty(value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setEnableFrequencyPenalty && setEnableFrequencyPenalty(checked);
    if (checked) {
      _setFrequencyPenalty(localFrequencyPenalty);
    } else {
      _setFrequencyPenalty(null);
    }
  };

  return (
    <div className='mt-5 pt-5 border-t border-gray-500'>
      <label className='block text-sm font-medium text-gray-900 dark:text-white'>
        {t('frequencyPenalty.label')}: {enableFrequencyPenalty ? localFrequencyPenalty : 'N/A'}
      </label>
      <Switch
        checked={enableFrequencyPenalty}
        onChange={handleSwitchChange}
        className='mb-2'
      />
      <input
        id='default-range'
        type='range'
        value={enableFrequencyPenalty ? localFrequencyPenalty : 0}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
        min={-2}
        max={2}
        step={0.1}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        disabled={!enableFrequencyPenalty}
      />
      <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
        {t('frequencyPenalty.description')}
      </div>
    </div>
  );
};


export default ConfigMenu;

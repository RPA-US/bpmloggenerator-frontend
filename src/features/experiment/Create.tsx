import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FirstStep from './FirstStep';


const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();
  const [ step, setStep ] = useState(1);

  return (
    <>
      <Typography variant="h4">
        { t('features.experiment.create.title') }
      </Typography>

      {
        step === 1 && (<FirstStep />)
      }
    </>
  )
}

export default CreateExperiment;
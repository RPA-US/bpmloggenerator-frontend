import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BackButton from 'components/BackButton';

const ScreenshotVariability: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [ loading, setLoading ] = useState(false)
  const dispatch = useDispatch();
 
  return (
    <>
      <Typography variant="h4">
        <BackButton to="/" />
        { t('features.experiment.create.title') }
      </Typography>
    </>
  )
}

export default ScreenshotVariability;
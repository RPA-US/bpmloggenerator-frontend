import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import { Card, CardContent, Theme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import ExperimentFormComponent from './Form';
import { experimentsSelector, createExperiment } from './slice';
import { useParams } from 'react-router-dom';
import { ThemeContext, useTheme } from '@emotion/react';
import { Experiment } from './types';

const ExperimentDetails: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { experiments } = useSelector(experimentsSelector);
  const { id } = useParams<{ id: string }>();
  const [ experiment, setExperiment ]:any = useState(null);
  
  useEffect(() => {
    // TODO get experiment
    const exp = experiments.find(experiment => experiment.id === parseInt(id));
    setExperiment(exp);
  }, [id]);

  return (
    <>
      <Typography variant="h4">
        { t('features.experiment.details.title') }
      </Typography>

      { experiment != null && (
        <Card style={{ marginTop: theme.spacing(4)}}>
          <CardContent>
            Name: { experiment.name }
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ExperimentDetails;
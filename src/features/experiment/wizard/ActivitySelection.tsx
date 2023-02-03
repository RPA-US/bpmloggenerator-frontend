import React, { useEffect,useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { experimentsSelector } from 'features/experiment/slice';
import BackButton from 'components/BackButton';
import DownloadButton from 'components/DownloadButton';
import configuration from "infrastructure/util/configuration";
import { wizardSelector, guiComponentCategoryRepository, wizardSlice } from 'features/experiment/wizard/slice';
import { CategoryDTO, CategoryResponse, } from 'infrastructure/http/dto/wizard';
import { authSelector } from 'features/auth/slice';
import UploadVaribilityConfButton from 'components/UploadVariabilityConfButton';

export interface ExperimentFormProperties {
  onSubmit: any
  disabled?: boolean,
  initialValues?: any
}

const ExperimentAssist: React.FC = () => {
  const { t } = useTranslation();
  const { seed, category_gui_components } = useSelector(wizardSelector);
  const { detail } = useSelector(experimentsSelector);
  const [guiComponent, setGuiComponent] = useState(true);
  const dispatch = useDispatch();
  const { token } = useSelector(authSelector);

  const getGUICat = async (token: string) => {
    let categories: CategoryResponse = await guiComponentCategoryRepository.list(token);
    dispatch(wizardSlice.actions.setGUIComponentCategories([...categories.results]));
    setGuiComponent(false)
  }

  useEffect(() => {
    if (guiComponent) {
      getGUICat(token??"")
    }
  }, []);

  const variantActivities = (entry: any) => {
    let variant = entry[0];
    let acts = entry[1];

    return Object.keys(acts).map(act => (
      <TableRow
        key={`${variant}-${act}`}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="center">
          <Button
            variant="contained"
            component={RouterLink}
            to={`${configuration.PREFIX}/column-variability/${variant}/${act}`}
          >
            {t("features.wizard.activitySelection.activity")} {act}
          </Button>
        </TableCell>
        <TableCell>
          {Object.keys(seed[variant][act]).some(column => seed[variant][act][column]['variate'] === 1) && (
            <div>
              {t("features.wizard.activitySelection.configured")}
              {/* <DoneIcon />Variability configured */}
            </div>
          )}

          {!Object.keys(seed[variant][act]).some(column => seed[variant][act][column]['variate'] === 1) && (
            <div>
              {t("features.wizard.activitySelection.not_configured")}
              {/* <CloseIcon /> Variability not configured */}
            </div>
          )}
        </TableCell>
      </TableRow>
    ))
  };

  return (
    <div>
      <Typography variant="h5">
        <BackButton to={(detail !== null) ? `${configuration.PREFIX}/experiment/${detail.id}` : `${configuration.PREFIX}/`} />
        {t('features.experiment.create.title')}
      </Typography>
      <Paper sx={{ width: '70%', overflow: 'hidden', margin: 'auto' }}>
        <UploadVaribilityConfButton scenario_variability_mode={false} />
        <TableContainer sx={{ maxHeight: '100%' }}>
          {
            Object.entries(seed).map(entry => (
              <Table sx={{ minWidth: 650 }} key={`${entry[0]}`} aria-label="variant activity selection">
                <TableHead>
                  <TableRow key="headers">
                    <TableCell align="center">{`${t("features.wizard.activitySelection.variant")} ${entry[0]}`}</TableCell>
                    <TableCell>{t("features.wizard.activitySelection.variate")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variantActivities(entry)}
                </TableBody>
              </Table>
            ))}
        </TableContainer>
        <DownloadButton filename='case_variability_configuration' scenario_variability_mode={false} />
      </Paper>
    </div>
  );
}

export default ExperimentAssist;
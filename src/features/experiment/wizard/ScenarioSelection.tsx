import React, { useContext } from 'react';
import { Button, Theme, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { wizardSelector } from 'features/experiment/wizard/slice';
import BackButton from 'components/BackButton';
import DownloadButton from 'components/DownloadButton';


const ScenarioSelection: React.FC = () => {
  const { t } = useTranslation();
  const { scenario_variability } = useSelector(wizardSelector);
  const screenshot_column_name = "Screenshot"; // TODO: generalize
  
  const variantActivities = (entry: any) => {
    let variant = entry[0];
    let acts = entry[1];
    
    return Object.keys(acts).map( act => (
      <TableRow
        key={`${variant}-${act}`}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
            <TableCell align="center">
              {t("features.wizard.activitySelection.activity")} {act}
            </TableCell>
            <TableCell align="center">
              <Button
                  disabled={scenario_variability[variant][act][screenshot_column_name].variate === 1}
                  variant="contained"
                  component={RouterLink}
                  to={`/get-gui-component-coordinates/scenario/${variant}/${act}/${scenario_variability[variant][act][screenshot_column_name].initValue}`}
                >
                {t("features.wizard.columnVariability.screenshotVariability")}
              </Button>
            </TableCell>
          </TableRow>
      ))};

  return (
    <div>
      <Typography variant="h5">
          <BackButton to="/add-experiment" />
          { t('features.experiment.create.title') }
      </Typography>
      <Paper sx={{ width: 'auto', overflow: 'hidden', margin: 'auto' }}>
      <TableContainer sx={{ maxHeight: '100%' }}>
        {
          Object.entries(scenario_variability).map(entry => (
            <Table sx={{ minWidth: 650 }} key={`${entry[0]}`} aria-label="variant activity selection">
            <TableHead>
            <TableRow key="headers">
              <TableCell align="center">{`${t("features.wizard.activitySelection.variant")} ${entry[0]}`}</TableCell>
              <TableCell align="center">{t("features.wizard.activitySelection.variate")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variantActivities(entry)}
          </TableBody>
        </Table>
        ))}
      </TableContainer>
      <DownloadButton filename='scenario_variability_configuration' scenario_variability_mode={true} />
    </Paper>
  </div>
  );
}

export default ScenarioSelection;
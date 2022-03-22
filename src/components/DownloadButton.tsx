import React, { useContext } from 'react';
import { Button, Grid, Theme } from "@mui/material";
import { ThemeContext } from '@emotion/react';
import { wizardSelector} from 'features/experiment/wizard/slice';
import { experimentsSelector } from 'features/experiment/slice';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import configuration from "infrastructure/util/configuration";
import { CategoryDTO } from 'infrastructure/http/dto/wizard';
import { useSelector } from 'react-redux';

export interface DownloadButtonProps {
  filename: string,
  scenario_variability_mode: boolean,
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ filename, scenario_variability_mode }) => {
  const history = useHistory();
  const theme = useContext(ThemeContext) as Theme;
  const { t } = useTranslation();
  const { detail } = useSelector(experimentsSelector);
  const { scenario_variability, seed, category_gui_components } = useSelector(wizardSelector);

  function selectGUICatLabel(categories: CategoryDTO[]) {
    let labels: string[] = categories.map(c => c.name)
    return labels;
  }

  let typeTMP = "text/json"
  let jsonTMP = seed;
  if (scenario_variability_mode) {
    jsonTMP = scenario_variability;
  }

  function downloadFunction(jsonTMP: any, type: string, filename: string) {
    const blob = new Blob([JSON.stringify(jsonTMP, null, 5)], { type: type })
    const a = document.createElement('a')
    a.download = filename + '.json'
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  function transformJson(jsonTMP:any){
    if (!scenario_variability_mode) {
      let tmpColumns, firstRowFile
      let firstRowkey = Object.keys(jsonTMP)[0]
      let secondRowkey = Object.keys(jsonTMP[firstRowkey])[0]
      firstRowFile = Object.keys(jsonTMP[firstRowkey][secondRowkey])
      let notList = ["Case", "Activity", "Screenshot", "Variant", ""]
      tmpColumns = firstRowFile.filter(function (obj: any) { return notList.indexOf(obj) === -1; })
      if (tmpColumns.indexOf("TextInput") > -1) {
        tmpColumns[tmpColumns.indexOf("TextInput")] = "features.experiment.GUI_category.name.TextInput"
      }
      selectGUICatLabel(category_gui_components)
      jsonTMP = {
        "columnsNames": tmpColumns,
        "GUIElements": selectGUICatLabel(category_gui_components),
        "trace": jsonTMP
      }
    }
    return jsonTMP
  }

  function handleDownload(e: any) {
   
    downloadFunction(transformJson(jsonTMP), typeTMP, filename);
  }

  function handleDownloadAndNext(e: any) {
    if (window.confirm(t('features.experiment.assist.download_confirmation'))) {
      downloadFunction(transformJson(jsonTMP), typeTMP, filename);
      history.push(configuration.PREFIX + '/experiment/' + detail?.id);
    }
  }


  return (
    <Grid
      container
      direction="row-reverse"
      spacing={2}>
      <Grid xs={12} lg={4} item justifyContent="center" style={{ margin: theme.spacing(2) }}>
        <Button type="submit" name="download" variant="contained" color="primary" style={{ margin: theme.spacing(2) }} endIcon={<DownloadIcon />} onClick={handleDownload}>
          {t('features.experiment.assist.download')}
        </Button>
        <Button type="submit" name="generate" variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleDownloadAndNext}>
          {t('features.experiment.assist.download_next')}
        </Button>
      </Grid>
    </Grid>
  );
}

export default DownloadButton;


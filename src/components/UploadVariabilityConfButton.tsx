import React, { useContext, useState } from 'react';
import { Grid, Theme } from "@mui/material";
import { ThemeContext } from '@emotion/react';
import { wizardSelector, wizardSlice } from 'features/experiment/wizard/slice';
import { useSelector, useDispatch } from 'react-redux';
import FormInput from 'components/FormInput';
import FileUpload from 'components/FileUpload';

export interface UploadVaribilityConfButtonProps {
    scenario_variability_mode: boolean,
}

const UploadVaribilityConfButton: React.FC<UploadVaribilityConfButtonProps> = ({ scenario_variability_mode }) => {
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext) as Theme;
    const { scenario_variability } = useSelector(wizardSelector);
    const [fileContents, setFileContents]: [ any, React.Dispatch<React.SetStateAction<any>> ] = useState({});

    let jsonTMP = scenario_variability;

    const readFileContent = (file: Blob) => new Promise<string>((resolve, reject) => {
        if (file == null) {
          reject(new Error('file cannot be null or undefined'));
        }
        const reader = new FileReader();
        reader.addEventListener('load', (evt: any) => resolve(evt.target.result));
        reader.addEventListener('error', reject);
        reader.readAsText(file);
    });

    function uploadFunction(json_conf: any) {
    
        if (scenario_variability_mode) {
            dispatch(wizardSlice.actions.setScenarioConfiguration(json_conf));
        } else {
            dispatch(wizardSlice.actions.setVariabilityConfiguration(json_conf));
        }
    }
  
    return (
      <Grid
        container
        direction="row-reverse"
        spacing={2}>
        <Grid xs={12} lg={12} item justifyContent="flex-basis" style={{ margin: theme.spacing(2) }}>
          <FormInput
              title={scenario_variability_mode?"features.experiment.form.scenario.label":"features.experiment.form.variability.label"}
              helperText={scenario_variability_mode?"features.experiment.form.scenario.helperText":"features.experiment.form.variability.helperText"}
              tooltip={scenario_variability_mode?"features.experiment.form.scenario.tooltip":"features.experiment.form.variability.tooltip"}
              style={{ marginTop: theme.spacing(2) }}
            >
            <FileUpload
              accept=".json"
              inputProps={{
                ...jsonTMP,
                onChange: (evt: any) => {
                  // jsonTMP.onChange(evt);
                  const file = evt.target.files[0];
                  readFileContent(file)
                    .then((content: string) => {
                      jsonTMP = JSON.parse(content)['trace'];
                      uploadFunction(jsonTMP);
                    })
                    .catch((err) => {
                      console.error('VARIABILITY JSON UPLOAD!: error reading file', err);
                    })
                }
              }}
            />
          </FormInput>
        </Grid>
      </Grid>
    );
  }
  
  export default UploadVaribilityConfButton;
import { useState } from 'react';

import { Field } from 'formik';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { FormLabel, FormControl, FormErrorMessage, useToast, Box } from '@chakra-ui/react';

import { onWarning } from 'utils';

import 'react-mde/lib/styles/css/react-mde-all.css';
import './FormTextarea.scss';

type FormTextareaProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  hideToolbar?: boolean;
  minEditorHeight?: number;
  controlStyle?: React.CSSProperties;
  customValidation?: {
    isRequired?: boolean;
    textPattern: 'temario' | 'list';
  };
};

export const FormTextarea = ({
  name,
  label,
  defaultValue = '',
  placeholder = '',
  isDisabled = false,
  hideToolbar = false,
  isRequired = false,
  minEditorHeight = 120,
  customValidation,
  controlStyle = {},
}: FormTextareaProps) => {
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

  const validateList = (value: string) => {
    let error;

    if (customValidation?.isRequired && !value) {
      error = `El campo ${label} es obligatorio.`;
    } else if (value) {
      let recommCount = 0;
      const list = value.split('\n');

      list.forEach((row: string, index: number) => {
        row = row.trimStart();

        if (row) recommCount++;

        if (row && !row.startsWith('-') && !row.startsWith('*')) {
          error = `Cada fila debe empezar con '-' o '*'. Revisa la línea ${index + 1}.`;
        }
      });

      if (recommCount > 5) onWarning(toast, 'Atención', `Es recomendable un número máximo de 5 ${name}`);
    }

    return error;
  };

  const validateTemario = (value: string) => {
    let error;

    if (customValidation?.isRequired && !value) {
      error = `El campo ${label} es obligatorio.`;
    } else if (value) {
      const list = value.split('\n');

      list.forEach((row: string, index: number) => {
        row = row.trimStart();

        if (row && !row.startsWith('-') && !row.startsWith('*') && !row.startsWith('#')) {
          error = `Cada tema debe empezar con '#', y cada subtema '-' o '*'. Revisa la línea ${index + 1}.`;
        }
      });
    }

    return error;
  };

  return (
    <Field
      name={name}
      validate={
        customValidation?.textPattern === 'list'
          ? validateList
          : customValidation?.textPattern === 'temario'
          ? validateTemario
          : undefined
      }
    >
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={{ width: '100%', ...controlStyle }} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <ReactMde
            value={field.value || ''}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            minEditorHeight={minEditorHeight}
            onChange={(e: string) => form.setFieldValue(name, e)}
            generateMarkdownPreview={(markdown) => Promise.resolve(<ReactMarkdown children={markdown || ''} />)}
            classes={{ toolbar: hideToolbar ? 'formtextarea-hidetoolbar' : '' }}
            childProps={{
              writeButton: { tabIndex: -1 },
              textArea: { placeholder: placeholder, disabled: isDisabled },
            }}
            toolbarCommands={[
              ['header', 'bold', 'italic', 'strikethrough'],
              ['link', 'unordered-list', 'ordered-list'],
            ]}
          />
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

import { useEffect, useState } from 'react';

import { Field } from 'formik';
import {
  FormLabel,
  FormControl,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Box,
} from '@chakra-ui/react';

export const FormRangeSlider = ({
  label,
  nameMin,
  nameMax,
  defaultValue,
  isRequired = false,
  isDisabled = false,
  controlStyle = {},
  style = {},
}: any) => {
  const [_value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onChangeStart = (e: any, form: any) => {
    form.setFieldValue(nameMin, e !== null ? e.value : null);
  };

  const onChangeEnd = (e: any, form: any) => {
    form.setFieldValue(nameMax, e !== null ? e.value : null);
  };

  return (
    <Field name={nameMin}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle}>
          <FormLabel className="form-label">
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <RangeSlider
            isDisabled={isDisabled}
            defaultValue={[10, 30]}
            aria-label={['min', 'max']}
            onChangeEnd={(value: any) => onChangeEnd(value, form)}
            onChangeStart={(value: any) => onChangeStart(value, form)}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>

            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          {/* <FormErrorMessage>{form.errors[name]}</FormErrorMessage> */}
        </FormControl>
      )}
    </Field>
  );
};

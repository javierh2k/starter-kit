import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import MultiSelect from './MultiSelect';


import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';


const userSchema = {
  email: Yup.string()
    .email('E-mail is not valid!')
    .required('E-mail is required!'),
  firstName: Yup.string()
    .required('Password is required!'),
  lastName: Yup.string()
    .required('Password confirmation is required!'),
  status: Yup.boolean(),
  topics: Yup.array()
    .min(1, 'Pick at least 1 tags')
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),

};

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape(userSchema),
  mapPropsToValues: props => ({
    email: props.data.email,
    lastName: "",
    firstName: "",
    status: props.data.status || true,
    topics: [],
  }),
  handleSubmit: (data, { setSubmitting }) => {
    const payload = {
      ...data,
      topics: data.topics.map(t => t.value),
    };
    setTimeout(() => {
      alert(JSON.stringify(payload, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'UserForm',
});



const UserForm = props => {
  const {
    values,
    options,
    touched,
    dirty,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = props;
  return (
    <form onSubmit={handleSubmit} >
      <div className="row">
        <div className="col-sm-12">
          <FormControl fullWidth>
            <InputLabel htmlFor="name-simple">firstName</InputLabel>
            <Input type="text" name="firstName" />
          </FormControl>
          {errors.firstName &&
            touched.firstName && (
              <div style={{ color: 'red', marginTop: '.5rem' }}>{errors.firstName}</div>
            )}
        </div>

        <div className="col-sm-12">
          <FormControl fullWidth aria-describedby="name-helper-text">
            <InputLabel htmlFor="name-helper">lastName</InputLabel>
            <Input name="lastName" />
            <FormHelperText >Some important helper text</FormHelperText>
          </FormControl>
          {errors.lastName &&
            touched.lastName && (
              <div style={{ color: 'red', marginTop: '.5rem' }}>{errors.lastName}</div>
            )}
        </div>
        <div className="col-sm-12 ">
          <FormControl fullWidth aria-describedby="name-helper-text">
            <InputLabel htmlFor="name-helper">email</InputLabel>
            <Input name="email" />
          </FormControl>
          {errors.email &&
            touched.email && (
              <div style={{ color: 'red', marginTop: '.5rem' }}>{errors.email}</div>
            )}
        </div>
        <div className="col-sm-12 ">
          <MultiSelect
            id="color"
            options={options}
            value={values.topics}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            error={errors.topics}
            touched={touched.topics}
          />
        </div>
      </div>

      <button
        type="button"
        className="outline"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
      >
        Reset
		  </button>
      <button type="submit" disabled={isSubmitting}>
        Submit
		  </button>

    </form>
  );
};


export default formikEnhancer(UserForm);

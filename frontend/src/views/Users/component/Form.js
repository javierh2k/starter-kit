import React from "react";
import * as Yup from "yup";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import NameIcon from "@material-ui/icons/SupervisorAccount";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";

import SaveIcon from '@material-ui/icons/Save';

export const userValidationSchema = Yup.object({
  name: Yup.string("Enter a name")
    .required("Name is required"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string("")
    .min(8, "Password must contain atleast 8 characters")
    .required("Enter your password"),
  confirmPassword: Yup.string("Enter your password")
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match")
});

export const UserForm = props => {
  const {
    values: { name, email, password, confirmPassword },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
    cancel,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    console.log(errors);
    setFieldTouched(name, true, false);
  };
  return (
    <form
      onSubmit={handleSubmit}
    >
      <TextField
        id="name"
        name="name"
        helperText={touched.name ? errors.name : ""}
        error={touched.name && Boolean(errors.name)}
        label="Name"
        value={name}
        onChange={change.bind(null, "name")}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">              <NameIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="email"
        name="email"
        placeholder="Email"
        helperText={touched.email ? errors.email : ""}
        error={touched.email && Boolean(errors.email)}
        label="Email"
        fullWidth
        value={email}
        onChange={change.bind(null, "email")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="password"
        name="password"
        helperText={touched.password ? errors.password : ""}
        error={touched.password && Boolean(errors.password)}
        label="Password"
        fullWidth
        type="password"
        value={password}
        onChange={change.bind(null, "password")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        helperText={touched.confirmPassword ? errors.confirmPassword : ""}
        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        label="Confirm Password"
        fullWidth
        type="password"
        value={confirmPassword}
        onChange={change.bind(null, "confirmPassword")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          )
        }}
      />
      <hr />
      <div className="text-right">
        <Button
          variant="raised"
          color="secondary"
          onClick={cancel}>Cancelar</Button>
        &nbsp;
        <Button
          type="submit"
          variant="contained" size="small"
          color="primary"
          disabled={!isValid}>
          <SaveIcon />
          GUARDAR
        </Button>
      </div>
    </form>
  );
};

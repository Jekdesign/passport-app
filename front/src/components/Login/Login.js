import React from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import API from "../../utils/API";
import './Login.css'

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}
export class Login extends React.Component {
  state = {
    email: '',
    password: '',
    errors : {
      email: '',
      password: ''
    },
    message: ''
  };
  send = async () => {
    const { email, password } = this.state;
    if (email && password && validateForm(this.state.errors)) {
      console.info('Valid Form')
      try {
        const { data } = await API.login(email, password);
        if(data.token){
          localStorage.setItem("token", data.token);
          window.location = "/game";
        }
        else{
          this.setState({
            message: data.info.message
          });
        }

      } catch (error) {
        console.error(error);
      }
    } else {
      this.setState({
        message: 'Invalid Form'
      });
    }
  };
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'email':
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password':
        errors.password =
          value.length < 8
            ? 'Password must be 8 characters long!'
            : '';
        break;
      default:
        break;
    }
    this.setState({
      [event.target.id]: event.target.value,
      errors, [name]: value
    });
  };
  render() {
    const { email, password, errors, message } = this.state;
    return (
      <div className="Login">
      {message.length > 0 && 
        <div className="alert alert-danger">{message}</div>}
        <FormGroup controlId="email" bssize="large" >
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            name='email'
            value={email}
            onChange={this.handleChange}
            placeholder="Enter email"
          />
          {errors.email.length > 0 && 
                <span className='error'>{errors.email}</span>}
        </FormGroup>
        <FormGroup controlId="password" bssize="large" >
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={this.handleChange}
            type="password"
            name='password'
            placeholder="Enter password"
          />
          {errors.password.length > 0 && 
                <span className='error'>{errors.password}</span>}
        </FormGroup>
        <Button onClick={this.send} block bssize='large' type="submit">
          Connexion
        </Button>
      </div>
    );
  }
}
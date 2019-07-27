import React, {Fragment} from 'react'
import spinner from './spinner.gif';

const BigSpinner = () => {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{width: '100px', margin:"auto"}}
        alt="loading"
      />
    </Fragment>
  )
}

export default BigSpinner
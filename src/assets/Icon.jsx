import React from 'react'
import icons from './Icons.svg'
import { cookies } from '../components/generic/UserContext'

const Icon = props => {
  return (
	<> 
	  {cookies.get('pageTheme') === 'light' ? (
		<svg
		  xmlns="http://www.w3.org/2000/svg"
		  xmlnsXlink="http://www.w3.org/1999/xlink"
		  className={props.className || 'h-6 w-6'}
		  fill={props.fill || 'none'} 
		  viewBox={props.viewBox || '0 0 26 26'}
		  stroke={props.stroke || 'currentColor'} 
		  strokeWidth={props.strokeWidth || '2'}
		>
		  <use xlinkHref={`${icons}#${props.name}`}/>
		</svg>
	  ) : (
		<svg
		  xmlns="http://www.w3.org/2000/svg"
		  xmlnsXlink="http://www.w3.org/1999/xlink"
		  className={props.className || (props.className || 'h-6 w-6')}
		  fill={props.altFill || (props.fill || 'none')} 
		  viewBox={props.altViewBox || (props.viewBox || '0 0 26 26')} 
		  stroke={props.altStroke || (props.stroke || 'currentColor')} 
		  strokeWidth={props.altStrokeWitdh || (props.strokeWidth || '2')} 
		>
    	  <use xlinkHref={`${icons}#${props.alt || props.name}`}/>
		</svg>
	  )}
	</>
	)
}
export default Icon
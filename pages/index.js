import {useState, useEffect} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ChatBot, {Loading} from 'react-simple-chatbot';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Dropdown = dynamic(
  async () => {
    const module = await import('reactjs-dropdown-component');
    const DD = module.Dropdown;

    return ({ forwardedRef, ...props }) => <DD ref={forwardedRef} {...props} />;
  },
  { ssr: false },
);

const DropdownMultiple = dynamic(
  async () => {
    const module = await import('reactjs-dropdown-component');
    const DDM = module.DropdownMultiple;

    return ({ forwardedRef, ...props }) => <DDM ref={forwardedRef} {...props} />;
  },
  { ssr: false },
);

const Header = () => {
 const locations = [
    {
      label: 'New York',
      value: 'newYork',
    },
    {
      label: 'Oslo',
      value: 'oslo',
    },
    {
      label: 'Istanbul',
      value: 'istanbul',
    }
 ];
const onChange = (item, name) => {
  console.log(item.value)
}
  return(
    <div style={{height:'60px', display:'flex', justifyContent:'space-between', alignItems:'center', backgroundColor:'#019376'}}>
      <div>
        <h4>BD-Translator</h4>
      </div>
      <div style={{marginRight:'10px'}}>
      <Dropdown
          name="location"
          title="Select location"
          searchable={["Search for location", "No matching location"]}
          list={locations}
          onChange={onChange}
          styles={{
            wrapper: {fontSize:'14px', height:'42px'},
            headerTitle: {marginRight:'2px'}
          }}
        />
        </div>
      </div>
  )
}

const Answer = (props) => {
  const [uvalue, setUvalue] = useState('')
  const [translation, setTranslation] = useState('')
  useEffect(() => {
    const {steps} = props
    const {search} = steps
    getTranslate(search.value)
  }, [])
 
  const getTranslate = async(val) => {
    try{
      const res = await axios.post('https://chat1.saifulbabo67646.repl.co', {text: val, target: 'bn'})
      setTranslation(res.data.translation) 
    }catch(err){
      console.log(err)
    }
  }
  const handleSpeak = () => {
    let utterance = new SpeechSynthesisUtterance(translation);
    utterance.rate = 0.8
    speechSynthesis.speak(utterance);
  }
  return (
    !translation ? <Loading /> :
     <div style={{ width: '100%' }}>
      <span>{translation}</span>
      <button onClick={handleSpeak}>speak</button>
    </div>
  )
}

export default function Home() {


  return (
    <div className={styles.container}>
      <ChatBot
        headerComponent = <Header/>
        steps={[
          {
            id: '0',
            message: 'Please Write a Message',
            trigger: 'search',
          },
          {
            id: '1',
            component: <Answer />,
            asMessage: true,
            delay: 4000,
            trigger: 'search',
          },
          {
            id:'search',
            user: true,
            trigger: '1'
          }
        ]}
      />
    </div>
  )
}

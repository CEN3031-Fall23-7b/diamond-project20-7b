import { message } from "antd"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel/BlocklyCanvasPanel"
import NavBar from "../../components/NavBar/NavBar"
import Blank from "./Blank";
import SplitPane from 'react-split-pane';
import CodeReplay from './CodeReplay'
import './Blank.css'

import {
  getAuthorizedWorkspaceToolbox,
  getActivityToolbox,
  getActivityToolboxAll,
} from "../../Utils/requests"
import { useGlobalState } from "../../Utils/userState"

export default function BlocklyPage({ isSandbox }) {
  const [value] = useGlobalState("currUser")
  const [activity, setActivity] = useState({})
  const navigate = useNavigate()
  //below modified to be true because of backend issues
  const [splitOpen, setSplitOpen] = useState(true)
  const [splitScreenEnabled, setSplitScreenEnabled] = useState(false);
  const [disableSplit, setDisableSplit] = useState(false);

  useEffect(() => {
    const setup = async () => {
      
      // if we are in sandbox mode show all toolbox
      const sandboxActivity = JSON.parse(localStorage.getItem("sandbox-activity"))
      if (isSandbox) {
        const AllToolboxRes = await getActivityToolboxAll()
        if (!sandboxActivity?.id || value.role === "Mentor") {
          if (AllToolboxRes.data) {
            let loadedActivity = {
              ...sandboxActivity,
              toolbox: AllToolboxRes.data.toolbox,
            }
            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(AllToolboxRes.err)
          }
        } else if (value.role === "ContentCreator") {
          const res = await getAuthorizedWorkspaceToolbox(sandboxActivity.id)
          if (res.data) {
            let loadedActivity = { ...sandboxActivity, selectedToolbox: res.data.toolbox }
            loadedActivity = { ...loadedActivity, toolbox: AllToolboxRes.data.toolbox }

            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(res.err)
          }
        }
      }
      // else show toolbox based on the activity we are viewing
      else {
        const localActivity = JSON.parse(localStorage.getItem("my-activity"))
        if (localActivity) {
          if (localActivity.toolbox) {
            setActivity(localActivity)
          } else {
            const res = await getActivityToolbox(localActivity.id)
            if (res.data) {
              let loadedActivity = { ...localActivity, toolbox: res.data.toolbox }

              localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
              setActivity(loadedActivity)
            } else {
              message.error(res.err)
            }
          }
        } else {
          navigate(-1)
        }
      }
    }

    setup()
  }, [isSandbox, navigate, value.role])

    const [leftPaneSize, setLeftPaneSize] = useState('50%');
    
    const handleDrag = newSize => {
      // The new size is greater than or equal to 50% of the window width
      if (newSize >= window.innerWidth / 2) {
        setLeftPaneSize(newSize);
      }
    };

  const handleToggleSplit = () => {
    const localActivity = JSON.parse(localStorage.getItem('my-activity'));
    if(localActivity.student_vis == true)
      if (!disableSplit) {
        setSplitOpen(!splitOpen);
      }
    else{
      setSplitOpen(false);
    }
  };
  //handles toggling split-screen 
  const handleToggleSplitD = () => {
    setDisableSplit(!disableSplit);
    setSplitOpen(false); //Close split-screen when disabling
  };

  const displayCodeReplay = () => {
    <Link id='replay-btn' className='btn' to={`/ccreplay/${activity.id}`}>
            View Code Replay
    </Link>
  };

    return (
        <div className="container nav-padding">
          <NavBar />
          { splitOpen && !disableSplit ? (
            <SplitPane
            split="vertical"
            minSize="50%"
            maxSize={-1} // No maximum size restriction
            defaultSize={leftPaneSize}
            onChange={handleDrag}
            pane1Style={{ minWidth: '50%'}}
            className="flex flex-row"
            >
                <BlocklyCanvasPanel activity={activity} setActivity={setActivity} isSandbox={isSandbox} toggleSplit={handleToggleSplit}/>
                <Blank />
            </SplitPane>
          ) :
          (
            <BlocklyCanvasPanel activity={activity} setActivity={setActivity} isSandbox={isSandbox} toggleSplit={handleToggleSplit} />
          )}
        </div>
    )
}

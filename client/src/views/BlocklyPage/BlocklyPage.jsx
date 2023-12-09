import { message } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel/BlocklyCanvasPanel"
import NavBar from "../../components/NavBar/NavBar"
import Blank from "./Blank";
import SplitPane from 'react-split-pane';
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
  const [splitOpen, setSplitOpen] = useState(true);
  const [leftPaneSize, setLeftPaneSize] = useState('50%');
  

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


  const handleDrag = newSize => {
    // The new size is greater than or equal to 50% of the window width
    if (newSize >= window.innerWidth / 2) {
      setLeftPaneSize(newSize);
    }
  };


    const handleToggleSplit = () => {
    setSplitOpen(!splitOpen);
    setLeftPaneSize(splitOpen ? '50%' : '100%'); // Adjust the size based on splitOpen state
  };

  const handleSwapSides = () => {
    setSplitOpen(!splitOpen);
    setLeftPaneSize(splitOpen ? '50%' : '50%');
  };

  return (
    <div className="container nav-padding">
      <NavBar />
      {/* On click swap sides of panes */}
      <button onClick={handleSwapSides}>Swap Sides</button>
      {/* On click Toggles split-screen on or off */}
      <button onClick={handleToggleSplit}>Toggle Split</button>
      <SplitPane
        split="vertical"
        minSize="50%"
        maxSize={-1}
        defaultSize={leftPaneSize}
        onChange={handleDrag}
        pane1Style={{ minWidth: '50%' }}
      >

        {/* if BlocklyCanvasPanel is open swap with Blank */}
        {splitOpen ? (
          <BlocklyCanvasPanel
            activity={activity}
            setActivity={setActivity}
            isSandbox={isSandbox}
            toggleSplit={handleToggleSplit}
          />
        ) : (
          <Blank />
        )}

        {/* if Blank is open swap with BlocklyCanvasPanel */}
        {splitOpen ? (
          <Blank />
        ) : (
          <BlocklyCanvasPanel
            activity={activity}
            setActivity={setActivity}
            isSandbox={isSandbox}
            toggleSplit={handleToggleSplit}
          />
        )}
      </SplitPane>
    </div>
  );
};


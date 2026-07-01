import React from 'react';
import ProgressSidebar from '../components/ProgressSidebar';
import ChatWindow from '../components/ChatWindow';


export default function Assistant({ chatState, setActiveTab }) {
  const {
    stage,
    setStage,
    subStage,
    setSubStage,
    furthestSubStage,
    history,
    sendMessage,
    selectedCriteria,
    setSelectedCriteria,
    shortlistedCareers,
    setShortlistedCareers,
    userProposedCareers,
    selectedCareer,
    setSelectedCareer,
    profileInfo,
    setProfileInfo,
    expertConsulted,
    setExpertConsulted,
    finalRoadmap,
    isLoading,
    resetSession,
    updateSession
  } = chatState;

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* Thanh bên cố định — không cuộn */}
      <ProgressSidebar 
        stage={stage} 
        subStage={subStage} 
        furthestSubStage={furthestSubStage}
        resetSession={resetSession} 
        onNavigate={(newStage, newSubStage) => updateSession({ stage: newStage, subStage: newSubStage })}
      />


      {/* Primary Chat Portal */}
      <ChatWindow
        stage={stage}
        setStage={setStage}
        subStage={subStage}
        setSubStage={setSubStage}
        history={history}
        sendMessage={sendMessage}
        isLoading={isLoading}
        selectedCriteria={selectedCriteria}
        setSelectedCriteria={setSelectedCriteria}
        shortlistedCareers={shortlistedCareers}
        setShortlistedCareers={setShortlistedCareers}
        userProposedCareers={userProposedCareers}
        selectedCareer={selectedCareer}
        setSelectedCareer={setSelectedCareer}
        profileInfo={profileInfo}
        setProfileInfo={setProfileInfo}
        expertConsulted={expertConsulted}
        setExpertConsulted={setExpertConsulted}
        finalRoadmap={finalRoadmap}
        updateSession={updateSession}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

import { Popover } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface DetectionInfoProps {
  stage: string;
  confidence: number;
  thumbnail?: string; // Optional thumbnail from detection
}

export const DetectionInfoPopover = ({ stage, confidence, thumbnail }: DetectionInfoProps) => {
    return (
      <Popover className="relative">
        <Popover.Button
          className="text-gray-400 hover:text-gray-600"
          title="Detection information"
        >
          <InformationCircleIcon className="h-5 w-5" />
        </Popover.Button>
  
        <Popover.Panel className="absolute z-10 mt-2 w-80 rounded-lg bg-white p-6 shadow-lg ring-1 ring-black ring-opacity-5">
          <h3 className="text-lg font-medium text-gray-700 mb-6">Details</h3>
          <div className="grid grid-cols-[auto,1fr] gap-x-4">
            {/* Left column */}
            <div className="grid grid-rows-3 gap-6 justify-items-center">
              <span className="text-gray-600 self-center">{stage}</span>
              {thumbnail ? (
                <img
                  src={`data:image/jpeg;base64,${thumbnail}`}
                  alt="Detection thumbnail"
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                />
              ) : (
                <div className="w-16 h-16 bg-pink-200 rounded-full" />
              )}
              <span className="text-gray-600 self-center">{confidence}%</span>
            </div>
            
            {/* Right column - unchanged */}
            <div className="grid grid-rows-3 gap-6 items-center">
              <div className="flex items-center">
                <div className="w-12 h-[2px] bg-gray-400"></div>
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-gray-400"></div>
                <span className="ml-2 text-gray-600">Stage of malaria</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-[2px] bg-gray-400"></div>
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-gray-400"></div>
                <span className="ml-2 text-gray-600">Spotted malaria in<br/>blood sample</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-[2px] bg-gray-400"></div>
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-gray-400"></div>
                <span className="ml-2 text-gray-600">Confidence level</span>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    )
}
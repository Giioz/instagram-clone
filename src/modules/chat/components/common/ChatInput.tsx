interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  socketStatus: string;
}

export default function ChatInput({ input, onInputChange, onSend, socketStatus }: ChatInputProps) {
  return (
    <form onSubmit={onSend} className="flex items-center gap-2 p-4 shrink-0">
      <div className="flex flex-1 items-center rounded-[22px] border border-[#363636] px-4 h-11 relative">
        <button type="button" className="flex items-center justify-center shrink-0">
          <svg aria-label="Choose an emoji" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Choose an emoji</title>
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
          </svg>
        </button>
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-transparent text-[15px] text-white placeholder-gray-400 outline-none px-3 min-w-0"
          autoComplete="off"
        />
        {!input.trim() ? (
          <div className="flex items-center shrink-0">
            <button type="button" className="flex items-center justify-center p-2 hover:text-gray-300 transition-colors">
              <svg aria-label="Voice Clip" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                <title>Voice Clip</title>
                <path d="M19.5 10.671v.897a7.5 7.5 0 0 1-15 0v-.897" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="19.068" y2="22"></line>
                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8.706" x2="15.104" y1="22" y2="22"></line>
                <path d="M12 15.745a4 4 0 0 1-4-4V6a4 4 0 0 1 8 0v5.745a4 4 0 0 1-4 4Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <button type="button" className="flex items-center justify-center p-2 hover:text-gray-300 transition-colors">
              <svg aria-label="Add Photo or Video" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                <title>Add Photo or Video</title>
                <path d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z" fillRule="evenodd"></path>
                <path d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <button type="button" className="flex items-center justify-center p-2 hover:text-gray-300 transition-colors">
              <svg aria-label="Choose a GIF or sticker" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                <title>Choose a GIF or sticker</title>
                <path d="M13.11 22H7.416A5.417 5.417 0 0 1 2 16.583V7.417A5.417 5.417 0 0 1 7.417 2h9.166A5.417 5.417 0 0 1 22 7.417v5.836a2.083 2.083 0 0 1-.626 1.488l-6.808 6.664A2.083 2.083 0 0 1 13.11 22Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <circle cx="8.238" cy="9.943" r="1.335"></circle>
                <circle cx="15.762" cy="9.943" r="1.335"></circle>
                <path d="M15.174 15.23a4.887 4.887 0 0 1-6.937-.301" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M22 10.833v1.629a1.25 1.25 0 0 1-1.25 1.25h-1.79a5.417 5.417 0 0 0-5.417 5.417v1.62a1.25 1.25 0 0 1-1.25 1.25H9.897" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={socketStatus !== "open"}
            className="flex items-center justify-center rounded-full bg-[#4254E0] text-white p-2 w-12.5 text-sm font-semibold hover:bg-[#4338ca] disabled:opacity-40 transition-colors shrink-0 mr-1"
          >
            <svg aria-label="Send" className="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
              <title>Send</title>
              <path d="M22.513 3.576C21.826 2.552 20.617 2 19.384 2H4.621c-1.474 0-2.878.818-3.46 2.173-.6 1.398-.297 2.935.784 3.997l3.359 3.295a1 1 0 0 0 1.195.156l8.522-4.849a1 1 0 1 1 .988 1.738l-8.526 4.851a1 1 0 0 0-.477 1.104l1.218 5.038c.343 1.418 1.487 2.534 2.927 2.766.208.034.412.051.616.051 1.26 0 2.401-.644 3.066-1.763l7.796-13.118a3.572 3.572 0 0 0-.116-3.863Z"></path>
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

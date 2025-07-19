flowchart TD A[User runs command] --> B{Which command?}

    B -->|dot-ui init| C[Init Command Flow]
    B -->|dot-ui add component| D[Add Command Flow]

    C --> C1["Project Setup Questions<br/>• Framework<br/>• Directory structure<br/>• Import alias"]
    C1 --> C2["Polkadot Library Selection<br/>PolkadotDetector.promptForLibrarySelection"]
    C2 --> C3[Create Project with Selected Library]

    D --> D1[Validate Component & Project]
    D1 --> D2["Detect Existing Library<br/>PolkadotDetector.detectPolkadotLibrary"]
    D2 --> D3{Library detected?}

    D3 -->|Yes - Papi| D4["Use Papi Registry<br/>registry-papi.json"]
    D3 -->|Yes - Dedot| D5["Use Dedot Registry<br/>registry-dedot.json"]
    D3 -->|No| D6["Prompt for Library Choice<br/>PolkadotDetector.promptForLibrarySelection"]

    D6 --> D7{User choice}
    D7 -->|Papi| D8["Set Registry to Papi<br/>registry.setSelectedLibrary(papi)"]
    D7 -->|Dedot| D9["Set Registry to Dedot<br/>registry.setSelectedLibrary(dedot)"]

    D4 --> D10[Install Component]
    D5 --> D10
    D8 --> D10
    D9 --> D10

    D10 --> D11[Setup API Based on Choice/Detection]
    D11 --> D12{Setup which API?}
    D12 -->|Papi| D13["Install polkadot-api<br/>Setup chains<br/>Generate types"]
    D12 -->|Dedot| D14["Install dedot<br/>Install @dedot/chaintypes"]

    D13 --> D15[Show Success & Next Steps]
    D14 --> D15
    C3 --> D15

    style D6 fill:#e1f5fe
    style C2 fill:#e1f5fe
    style D7 fill:#fff3e0
    style D12 fill:#fff3e0

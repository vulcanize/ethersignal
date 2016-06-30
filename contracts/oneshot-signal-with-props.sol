contract EthSignal {
    
    // events
    event userVotedEvent(uint proposalID, bool position, address voter);
    event proposalCreatedEvent(string proposalName, string proposalDescription, address creator);
    
    //modifiers
    
    // objects
    struct Proposal {
        string name;
        string description;
        address creator;
        mapping (address => bool) votedYes;
        mapping (address => bool) votedNo;
        bool active;
    }
    
    Proposal[] public proposals;
    
    //methods
    function EthSignal()
    {
        //this runs once on contract deployment
    }
    
    function newProposal(string proposalName, string proposalDescription){
        uint proposalID = proposals.length++;
        Proposal p = proposals[proposalID];
        p.name = proposalName;
        p.description = proposalDescription;
        p.creator = msg.sender;
        p.active = true;
        proposalCreatedEvent(proposalName, proposalDescription, msg.sender);
    }
    
    function numberOfProposals() constant returns (uint _numberOfProposals) {
        return proposals.length;
    }

    function vote(uint proposalID, bool position){
        Proposal p = proposals[proposalID];
        
        if (!p.active){
            throw;
        }
        
        // Sorry, no do overs.
        if (p.votedYes[msg.sender]
            || p.votedNo[msg.sender]) {
            throw;
        }
        
        // Keep track of who voted what
        if (position){ 
            p.votedYes[msg.sender] = true; 
            
        } else{ 
            p.votedNo[msg.sender] = true; 
            
        }
        
        //Send the signal
        userVotedEvent(proposalID, position, msg.sender);
    }
    
    

    function (){
        //This aint no charity.
        throw;
    }
    
}


import json
import os

class ScientificLibrarian:
    """
    The Librarian Agent: Responsible for retrieving scientific context 
    from the knowledge base to ground LLM responses (RAG).
    """
    def __init__(self):
        # Determine the base directory for data relative to this service file
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, "data", "science_db.json")
        
        try:
            # Ensure directory exists for robust initialization
            if not os.path.exists(os.path.dirname(db_path)):
                os.makedirs(os.path.dirname(db_path))
                
            if os.path.exists(db_path):
                with open(db_path, "r") as f:
                    self.database = json.load(f)
            else:
                self.database = []
        except Exception as e:
            print(f"Librarian: Failed to load science_db.json: {e}")
            self.database = []

    def retrieve_context(self, query_text: str):
        """
        Simple tag-based retrieval logic. Searches for keywords in the knowledge base.
        """
        query_words = query_text.lower().replace('-', ' ').split()
        relevant_entries = []
        
        for entry in self.database:
            tags = entry.get("tags", [])
            # Check if any word in the query matches any tag in this entry
            if any(word in [tag.lower() for tag in tags] for word in query_words):
                relevant_entries.append(entry.get("content", ""))
        
        if not relevant_entries:
            # Generic fallback if no specific scientific context matches
            return "General cognitive health depends on consistent sleep cycles, balanced diet, and regular physical exercise. Cognitive velocity is highly sensitive to neurological fatigue."
            
        return " ".join(relevant_entries)

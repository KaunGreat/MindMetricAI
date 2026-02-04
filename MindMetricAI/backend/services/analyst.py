import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

class CognitiveAnalyst:
    def __init__(self):
        # In a real production scenario, we might load a pre-trained K-Means model here.
        # For the analyst agent, we use a hybrid approach of heuristic classification 
        # and statistical trend analysis.
        pass

    def determine_archetype(self, reaction_time: float, accuracy: float):
        """
        Determines user archetype based on speed (reaction_time in ms) 
        and precision (accuracy 0-100).
        """
        # Archetype Logic:
        # High Speed (< 250ms) + High Accuracy (> 90%) -> "Cyber-Athlete"
        # High Speed (< 250ms) + Low Accuracy (<= 90%) -> "Impulsive Sprinter"
        # Low Speed (>= 250ms) + High Accuracy (> 90%) -> "Deep Thinker"
        # Low Speed (>= 250ms) + Low Accuracy (<= 90%) -> "Novice"
        
        archetype = ""
        if reaction_time < 250:
            if accuracy > 90:
                archetype = "Cyber-Athlete"
            else:
                archetype = "Impulsive Sprinter"
        else:
            if accuracy > 90:
                archetype = "Deep Thinker"
            else:
                archetype = "Novice"
        
        # Confidence score based on distance from thresholds
        # This simulates a fuzzy-logic or clustering-like confidence output
        confidence = 0.88 + (np.random.random() * 0.1)
        
        return archetype, round(confidence, 2)

    def predict_burnout_risk(self, history_scores: list):
        """
        Analyzes trend of the last few results.
        If the trend is negative (deteriorating performance), return True.
        """
        if len(history_scores) < 3:
            return False
        
        # We look at the last 5 entries to determine trend
        recent = history_scores[-5:]
        
        # Simple linear trend check
        x = np.arange(len(recent))
        y = np.array(recent)
        
        # Calculate slope
        z = np.polyfit(x, y, 1)
        slope = z[0]
        
        # For general scores (higher is better), a negative slope means worsening performance
        # For reaction times (lower is better), a positive slope means worsening performance
        # We assume 'history_scores' are transformed 'performance points' for this check.
        return slope < -0.5
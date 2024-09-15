This project applies the Random Forest machine learning technique to generate safety ratings for different roads. By analyzing historical crash data, road conditions, traffic density, and other relevant factors, the model predicts road safety levels. The purpose is to help users make informed travel decisions by identifying safer routes.


Historical crash statistics
Road types (e.g., highways, urban streets, rural roads)
Traffic conditions
Weather patterns
Road infrastructure (e.g., number of lanes, lighting, signage)
These ratings are intended to:

Assist users in selecting safer routes for their journeys.
Provide insights for city planners and transportation authorities.
Support insurance companies, rideshare services, and navigation tools in improving road safety.
Data
The model leverages publicly available datasets, which include:

Crash records and severity levels
Road network details such as road type, traffic signals, and signage
Environmental data such as weather conditions
Traffic flow statistics
The data is preprocessed by cleaning, extracting relevant features, and encoding necessary categorical variables.

Model
A Random Forest classifier is used to predict the safety ratings. Random Forest is well-suited for this project due to its robustness and ability to handle complex datasets with many features. The key features used by the model include:

Road safety history
Traffic patterns and congestion
Infrastructure details (number of lanes, lighting, etc.)
Local weather conditions
Model Evaluation
The model is evaluated based on its performance in predicting safety ratings. Key metrics used include:

Accuracy: How often the model predicts the correct safety rating.
Precision and Recall: The balance between identifying dangerous roads and not mislabeling safe roads.
F1-Score: A measure of the model’s accuracy, considering both precision and recall.
Confusion Matrix: To visualize the distribution of predicted vs. actual safety ratings.
Results
The model has demonstrated high accuracy in predicting safety ratings on test data, offering a useful tool for identifying safe and unsafe roads. The accuracy, along with other evaluation metrics like precision and recall, reflects the model's ability to predict road safety effectively. Future work can include expanding the dataset and improving the model by incorporating more complex features and tuning parameters.

Contributing
Contributions to this project are welcome. Whether it's improving the model, suggesting additional features, or enhancing documentation, all feedback and pull requests are appreciated.

License
This project is licensed under the MIT License

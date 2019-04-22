Start
=====

## Case 001 (start,dialog_left)
:NURSE Agnes: Doctor, we have a man (51 years old) who entered the emergency department reporting chest pain. His vital signs are ABP: 144x92mmHG; HR: 78bpm; RR: 21rpm; Temp: 37oC; O2Sat: 98%.

* Let us go! -> Cycle 1.Begin

Cycle 1
=======

Begin (information)
-------------------

:PATIENT Jakob: Doctor, I am feeling chest pain since yesterday. The pain is continuous and is located just in the middle of my chest, worsening when I breathe and when I lay down on my bed. I suffer from arterial hypertension and smoke 20 cigarettes every day. My father had a “heart attack” at my age and I am very worried about it.

<b>PHYSICAL EXAMINATION</b> <br> The cardiac and pulmonary auscultation are normal; chest pain does not worse with palpation of the thorax; there is no jugular stasis nor lower limb edema.

:Jacinto:What do you want to do?

* -> Generate hypothesis
* -> More information
* Call the supervisor -> Call the supervisor.A

Generate hypothesis (input)
---------------------------
What is your main diagnostic hypothesis?
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit hypothesis -> Check hypothesis

More information (information)
------------------------------

<b>MORE INFORMATION</b> <br> The patient never felt chest pain before. He exercises regularly and has lost weight in the last three months. He takes amlodipine and losartan regularly. Two weeks ago, he had an auto-limited gastroenteritis episode. He denies recent travels and surgery.
:PATIENT Jakob:.

:Jacinto:What do you want to do?

* Generate hypothesis -> Generate hypothesis
* Call the supervisor -> Call the supervisor.A

Call the supervisor
-------------------

### A (detailed)
:SUPERVISOR Harry:
Hi! I am glad that you called me. Chest pain is an important complaint at the emergency department and we have to exclude the fatal causes: myocardial infarction (MI), acute aortic dissection (AAD), pulmonary embolism PE), hypertensive pneumothorax (HP), and Boerhaave Syndrome (BS).

The best way to find out what is happening with your patient, my young padawan, is to gather as much information as possible through history taking and physical examination. We need to search for the signs and symptoms that can guide our clinical reasoning process by changing the pre-test probabilities of each disease.
::

* See likelihood tables -> B 

### B (detailed)
:SUPERVISOR Harry:.
**Likelihood Tables**

Do you know the concept of Likelihood ratio (LR)? -> Likelihood Ratio

+ -> Clinical History Myocardial Infarction

+ -> Physical Examination Myocardial Infarction

+ -> Clinical History Aortic Dissection

+ -> Physical Examination Aortic Dissection

+ -> Pulmonary Embolism Wells Criteria

* Continue talking -> C 

### C (detailed)
:SUPERVISOR Harry:.
Hypertensive pneumothorax is more common in tall and thin young adults (primary pneumothorax) or in patients with chronic pulmonary diseases or chest trauma (secondary pneumothorax). On physical examination, we expect asymmetry in lung auscultation and the trachea may be dislocated to the contralateral side of the pneumothorax.

Boerhaave Syndrome is more common in patients who presented vomiting before the chest pain started, were submitted to endoscopic procedures or had chest trauma.

How does this information can help you to solve your case?

* Back to the case -> Cycle 1.Begin

### Likelihood Ratio (note)

Likelihood ratio (LR) - like sensitivity and specificity, LR describe the discriminatory power of features in a clinical context, estimating the probability of disease. When the LR is higher than 1, the feature increases the probability; when lower than 1, reduces it.

* Back -> Supervisor B

### Clinical History Myocardial Infarction (note)
![Clinical History Myocardial Infarction](images/ebm-clinical-history-myocardial-infarction.png)

* Back -> Supervisor B

### Physical Examination Myocardial Infarction (note)
![Physical Examination Myocardial Infarction](images/ebm-physical-examination-myocardial-infarction.png)

* Back -> Supervisor B

### Clinical History Aortic Dissection (note)
![Clinical History Aortic Dissection](images/ebm-clinical-history-aortic-dissection.png)

* Back -> Supervisor B

### Physical Examination Aortic Dissection (note)
![Physical Examination Aortic Dissection](images/ebm-physical-examination-aortic-dissection.png)

* Back -> Call the supervisor B

### Pulmonary Embolism Wells Criteria (note)
![Pulmonary Embolism Wells Criteria](images/ebm-pulmonary-embolism-wells-criteria.png)

* Back -> Call the supervisor B

Check hypothesis (selector)
---------------------------

:Jacinto:Let us check out your hypothesis. Highlight in green the findings that corroborate your hypothesis; in blue those that are neutral; and in red the ones speaking against your hypothesis.

{{symptoms#contribution to diagnostics: ,+,=,-
Nurse: Doctor, please you have to evaluate a {man(male)} ({51 years-old(aging=51)#=}) who entered the emergency department reporting {chest pain#=}.His vital signs are {ABP: 144x92mmHG#=}; {HR: 78bpm#=}; {RR: 21rpm#=}; {Temp: 37oC#=}; {O2Sat: 98%#=}.

Patient: Doctor, I am feeling chest pain since yesterday. The {pain is continuous#=} and {is located just in the middle of my chest#=}, {worsening when I breathe#+} and {when I lay down on my bed#+}. I have {arterial hypertension#-} and {I smoke 20 cigarettes(smoking=20/day)#-} every day. {My father had a "heart attack"#-} at my age and I am very worried about it.

You perform physical examination: {cardiac and pulmonary auscultation are normal#-}; {chest pain does not worse with palpation of the thorax#=}; {there is no jugular stasis#=} {nor lower limb edema#=}.
}}

* Submit -> Review hypothesis 

Review hypothesis (input)
-------------------------
If you whant to review your hypothesis, type below the new hypothesis.
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit -> Cycle 2.Order EKG

Cycle 2
=======

## Order EKG (decision_exam)
Our patient denies any recent long trip, immobilization or surgery.

The blood pressure is symmetric in the four limbs. 

:EKG:.

* Magnify -> Magnify EKG

:Game: What do you want to do?
* -> Generate hypothesis
* -> More information
* -> Call the supervisor


## Magnify EKG (note,magnify_exam)

:EKG:.

* Return -> Order EKG

## Generate hypothesis (input)
What is your main diagnostic hypothesis?
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit hypothesis -> Check hypothesis

## More information (decision_exam)

![EKG Description](images/ekg-description.png)

* EKG Analysis

:EKG:.

:Game: What do you want to do?
* Back -> Order EKG
* Analyze EKG -> EKG Analysis

## EKG Analysis (note,marker_exam)

<dcc-group-marker context="ekg" image="images/ekg.png">
   <dcc-image-marker id="DI" label="DI" coords="238,127,164,76" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DII" label="DII" coords="231,328,148,273" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DIII" label="DIII" href="" coords="67,484,148,528" image="images/ekg-detail-02.png"></dcc-image-marker>
   <dcc-image-marker id="aVL" label="aVL" coords="413,286,515,332" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="IV" label="IV" coords="1005,40,1123,130" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="V" label="V" coords="1004,248,1133,323" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="VI" label="VI" coords="1010,460,1130,538" image="images/ekg-detail-01.png"></dcc-image-marker>
</dcc-group-marker>

* Return -> Order EKG

## Call the supervisor (decision_exam)

We did not find features that increase the likelihood of myocardial ischemia. Moreover, our patient has a pleuritic chest pain that gets worse when the patient lays down.

In the EKG we found ST-segment elevation in almost all leads. Also, we found a depression of the PR segment in the DII lead.

* -> EKG Analysis

:EKG:.

:Game: What do you want to do?
* Back -> Order EKG
* Analyze EKG -> EKG Analysis

## Check hypothesis (marker_exam)

<dcc-group-marker context="ekg" image="images/ekg.png">
   <dcc-image-marker id="DI" label="DI" coords="238,127,164,76" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DII" label="DII" coords="231,328,148,273" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DIII" label="DIII" href="" coords="67,484,148,528" image="images/ekg-detail-02.png"></dcc-image-marker>
   <dcc-image-marker id="aVL" label="aVL" coords="413,286,515,332" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="IV" label="IV" coords="1005,40,1123,130" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="V" label="V" coords="1004,248,1133,323" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="VI" label="VI" coords="1010,460,1130,538" image="images/ekg-detail-01.png"></dcc-image-marker>
</dcc-group-marker>

* Submit -> Review hypothesis

## Review hypothesis (input)
If you whant to review your hypothesis, type below the new hypothesis.
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit -> Final.Report

Final
=====

Report (detailed)
-----------------

Congratulations, my young Dr. you could helped your patient providing his diagnosis. Now, Let's review all levels of this case.

:Computer:Select a final report level:

* -> Level 1
* -> Level 2.2a
* -> Level 3.3a

Level 1 (detailed)
------------------

<b>Level 1</b>: your answer was <dcc-expression expression="Cycle_1.Generate_hypothesis.hypothesis"></dcc-expression>.

Our patient complained about chest pain, located in the middle of his chest, worsening when he breaths and when he lay down on his bed. Both features increases the probability of pericardial disease, especially acute pericarditis. Although patient´s father died of a "heart attack", there were no chest pain features that increase the probability of myocardial infarction, as the pain did not irradiate to arms, the pain was not described as a pressure, neither complaining about nausea, vomiting or shortness of breath. Another differential diagnosis to consider is myopericarditis, but we not be able to find heart failure signs (pulmonary and cardiac auscultation were normal) and the patient did not complain about dyspnea. So, at the level 1, the answer to our open-ended question was Acute Pericarditis.

* Next -> Level 2.2a
* Return -> Report

Level 2
-------

### 2a (detailed)

<div style="font-size: 14px">
<b>Level 2</b>: At this level, we asked you to highlight in green all features that corroborate your hypothesis, in blue those are neutral and in red the ones speaking against your hypothesis.
<br><br>
<b>Your answer:</b>
<br>
{{player#Cycle_1.Check_hypothesis.symptoms: ,+,=,-
Nurse: Doctor, please you have to evaluate a {man(male)} ({51 years-old(aging=51)#=}) who entered the emergency department reporting {chest pain#=}.His vital signs are {ABP: 144x92mmHG#=}; {HR: 78bpm#=}; {RR: 21rpm#=}; {Temp: 37oC#=}; {O2Sat: 98%#=}.
<br>
Patient: Doctor, I am feeling chest pain since yesterday. The {pain is continuous#=} and {is located just in the middle of my chest#=}, {worsening when I breathe#+} and {when I lay down on my bed#+}. I have {arterial hypertension#-} and {I smoke 20 cigarettes(smoking=20/day)#-} every day. {My father had a "heart attack"#-} at my age and I am very worried about it.
<br>
You perform physical examination: {cardiac and pulmonary auscultation are normal#-}; {chest pain does not worse with palpation of the thorax#=}; {there is no jugular stasis#=} {nor lower limb edema#=}.
}}
<br><br>
<b>Our answer:</b> 
<br>
{{answers#answers: ,+,=,-
Nurse: Doctor, please you have to evaluate a {man(male)} ({51 years-old(aging=51)#=}) who entered the emergency department reporting {chest pain#=}.His vital signs are {ABP: 144x92mmHG#=}; {HR: 78bpm#=}; {RR: 21rpm#=}; {Temp: 37oC#=}; {O2Sat: 98%#=}.
<br>
Patient: Doctor, I am feeling chest pain since yesterday. The {pain is continuous#=} and {is located just in the middle of my chest#=}, {worsening when I breathe#+} and {when I lay down on my bed#+}. I have {arterial hypertension#-} and {I smoke 20 cigarettes(smoking=20/day)#-} every day. {My father had a "heart attack"#-} at my age and I am very worried about it.
<br>
You perform physical examination: {cardiac and pulmonary auscultation are normal#-}; {chest pain does not worse with palpation of the thorax#=}; {there is no jugular stasis#=} {nor lower limb edema#=}.
}}
</div>

* Next -> 2b
* Return -> Final.Report

### 2b (detailed)

After checking the hypothesis you reviewed your answer to: <dcc-expression expression="Cycle_1.Review_hypothesis.hypothesis"></dcc-expression>.

In acute pericarditis, patients are usually young, most cases are reported under 50 years old, but it can be diagnosed at any age. There is no vital signs features that increase the probability of this condition. Some patients may present fever and tachycardia, but it´s not common signs. So, when vital signs are normal, we cannot confirm or exclude this diagnosis.

In clinical history, two features increase the probability of the chest pain being related to a pericardial disease: worsening with breathing; and worsening when the patient lay down. 

* Next -> 2c
* Return -> Final.Report

### 2c (detailed)

As the patient has arterial hypertension, is smoker and his father died of a "heart attack" we could consider myocardial infarction as one of the diagnosis. But considering chest pain features of our patient, there is no one that increases this possibility. So, these features may lead us to cognitive error if we consider myocardial infarction as the main diagnosis (which is wrong). 

In physical examination in patients with acute pericarditis, we may find pericardial rub, one of the diagnostic criteria. So, when we did not find it, the probability of the disease is reduced, but did not exclude the diagnosis. It is crucial to look for the other diagnostic criteria.

* Next -> Level 3.3a
* Return -> Final.Report

Level 3
-------

### 3a (detailed)

My young Dr, the EKG interpretation was very helpful to solve our case.

We found a diffuse ST-segment elevation, and a PR-segment depression in DII lead.  These findings, associated to the clinical scenario, strongly indicate the main hypothesis of Acute Pericarditis.

* Next -> 3b
* Return -> Final.Report

### 3b (detailed)

My young Dr, the EKG interpretation was very helpful to solve our case.

We found a diffuse ST-segment elevation, and a PR-segment depression in DII lead.  These findings, associated to the clinical scenario, strongly indicate the main hypothesis of Acute Pericarditis.

* Next -> 3c
* Return -> Final.Report

### 3c (detailed)
<div style="font-size: 18px">
In the following table, we provide the diagnostic criteria for acute pericaditis and myopericarditis:

![Clinical History Myocardial Infarction](images/ebm-pericarditis.png)

Cooper LT, Imazio M. Management of myopericarditis. Expert Rev Cardiovasc Ther 2013; 11(2): 193-201.

Our patient fullfill the following criteria: 1 and 3. So, acute pericarditis is the main diagnostic hypothesis.
</div>

* Return -> Final.Report  Start
=====

## Case 001 (start,dialog_left)
:NURSE Agnes: Doctor, we have a man (51 years old) who entered the emergency department reporting chest pain. His vital signs are ABP: 144x92mmHG; HR: 78bpm; RR: 21rpm; Temp: 37oC; O2Sat: 98%.

* Let us go! -> Cycle 1.Begin

Cycle 1
=======

Begin (information)
-------------------

:PATIENT Jakob: Doctor, I am feeling chest pain since yesterday. The pain is continuous and is located just in the middle of my chest, worsening when I breathe and when I lay down on my bed. I suffer from arterial hypertension and smoke 20 cigarettes every day. My father had a “heart attack” at my age and I am very worried about it.

<b>PHYSICAL EXAMINATION</b> <br> The cardiac and pulmonary auscultation are normal; chest pain does not worse with palpation of the thorax; there is no jugular stasis nor lower limb edema.

:Jacinto:What do you want to do?

* -> Generate hypothesis
* -> More information
* Call the supervisor -> Call the supervisor.A

Generate hypothesis (input)
---------------------------
What is your main diagnostic hypothesis?
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit hypothesis -> Check hypothesis

More information (information)
------------------------------

<b>MORE INFORMATION</b> <br> The patient never felt chest pain before. He exercises regularly and has lost weight in the last three months. He takes amlodipine and losartan regularly. Two weeks ago, he had an auto-limited gastroenteritis episode. He denies recent travels and surgery.
:PATIENT Jakob:.

:Jacinto:What do you want to do?

* Generate hypothesis -> Generate hypothesis
* Call the supervisor -> Call the supervisor.A

Call the supervisor
-------------------

### A (detailed)
:SUPERVISOR Harry:
Hi! I am glad that you called me. Chest pain is an important complaint at the emergency department and we have to exclude the fatal causes: myocardial infarction (MI), acute aortic dissection (AAD), pulmonary embolism PE), hypertensive pneumothorax (HP), and Boerhaave Syndrome (BS).

The best way to find out what is happening with your patient, my young padawan, is to gather as much information as possible through history taking and physical examination. We need to search for the signs and symptoms that can guide our clinical reasoning process by changing the pre-test probabilities of each disease.
::

* See likelihood tables -> B 

### B (detailed)
:SUPERVISOR Harry:.
**Likelihood Tables**

Do you know the concept of Likelihood ratio (LR)? -> Likelihood Ratio

+ -> Clinical History Myocardial Infarction

+ -> Physical Examination Myocardial Infarction

+ -> Clinical History Aortic Dissection

+ -> Physical Examination Aortic Dissection

+ -> Pulmonary Embolism Wells Criteria

* Continue talking -> C 

### C (detailed)
:SUPERVISOR Harry:.
Hypertensive pneumothorax is more common in tall and thin young adults (primary pneumothorax) or in patients with chronic pulmonary diseases or chest trauma (secondary pneumothorax). On physical examination, we expect asymmetry in lung auscultation and the trachea may be dislocated to the contralateral side of the pneumothorax.

Boerhaave Syndrome is more common in patients who presented vomiting before the chest pain started, were submitted to endoscopic procedures or had chest trauma.

How does this information can help you to solve your case?

* Back to the case -> Cycle 1.Begin

### Likelihood Ratio (note)

Likelihood ratio (LR) - like sensitivity and specificity, LR describe the discriminatory power of features in a clinical context, estimating the probability of disease. When the LR is higher than 1, the feature increases the probability; when lower than 1, reduces it.

* Back -> Supervisor B

### Clinical History Myocardial Infarction (note)
![Clinical History Myocardial Infarction](images/ebm-clinical-history-myocardial-infarction.png)

* Back -> Supervisor B

### Physical Examination Myocardial Infarction (note)
![Physical Examination Myocardial Infarction](images/ebm-physical-examination-myocardial-infarction.png)

* Back -> Supervisor B

### Clinical History Aortic Dissection (note)
![Clinical History Aortic Dissection](images/ebm-clinical-history-aortic-dissection.png)

* Back -> Supervisor B

### Physical Examination Aortic Dissection (note)
![Physical Examination Aortic Dissection](images/ebm-physical-examination-aortic-dissection.png)

* Back -> Call the supervisor B

### Pulmonary Embolism Wells Criteria (note)
![Pulmonary Embolism Wells Criteria](images/ebm-pulmonary-embolism-wells-criteria.png)

* Back -> Call the supervisor B

Check hypothesis (selector)
---------------------------

:Jacinto:Let us check out your hypothesis. Highlight in green the findings that corroborate your hypothesis; in blue those that are neutral; and in red the ones speaking against your hypothesis.

{{symptoms#contribution to diagnostics: ,+,=,-
Nurse: Doctor, please you have to evaluate a {man(male)} ({51 years-old(aging=51)#=}) who entered the emergency department reporting {chest pain#=}.His vital signs are {ABP: 144x92mmHG#=}; {HR: 78bpm#=}; {RR: 21rpm#=}; {Temp: 37oC#=}; {O2Sat: 98%#=}.

Patient: Doctor, I am feeling chest pain since yesterday. The {pain is continuous#=} and {is located just in the middle of my chest#=}, {worsening when I breathe#+} and {when I lay down on my bed#+}. I have {arterial hypertension#-} and {I smoke 20 cigarettes(smoking=20/day)#-} every day. {My father had a "heart attack"#-} at my age and I am very worried about it.

You perform physical examination: {cardiac and pulmonary auscultation are normal#-}; {chest pain does not worse with palpation of the thorax#=}; {there is no jugular stasis#=} {nor lower limb edema#=}.
}}

* Submit -> Review hypothesis 

Review hypothesis (input)
-------------------------
If you whant to review your hypothesis, type below the new hypothesis.
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit -> Cycle 2.Order EKG

Cycle 2
=======

## Order EKG (decision_exam)
Our patient denies any recent long trip, immobilization or surgery.

The blood pressure is symmetric in the four limbs. 

:EKG:.

* Magnify -> Magnify EKG

:Game: What do you want to do?
* -> Generate hypothesis
* -> More information
* -> Call the supervisor


## Magnify EKG (note,magnify_exam)

:EKG:.

* Return -> Order EKG

## Generate hypothesis (input)
What is your main diagnostic hypothesis?
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit hypothesis -> Check hypothesis

## More information (decision_exam)

![EKG Description](images/ekg-description.png)

* EKG Analysis

:EKG:.

:Game: What do you want to do?
* Back -> Order EKG
* Analyze EKG -> EKG Analysis

## EKG Analysis (note,marker_exam)

<dcc-group-marker context="ekg" image="images/ekg.png">
   <dcc-image-marker id="DI" label="DI" coords="238,127,164,76" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DII" label="DII" coords="231,328,148,273" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DIII" label="DIII" href="" coords="67,484,148,528" image="images/ekg-detail-02.png"></dcc-image-marker>
   <dcc-image-marker id="aVL" label="aVL" coords="413,286,515,332" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="IV" label="IV" coords="1005,40,1123,130" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="V" label="V" coords="1004,248,1133,323" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="VI" label="VI" coords="1010,460,1130,538" image="images/ekg-detail-01.png"></dcc-image-marker>
</dcc-group-marker>

* Return -> Order EKG

## Call the supervisor (decision_exam)

We did not find features that increase the likelihood of myocardial ischemia. Moreover, our patient has a pleuritic chest pain that gets worse when the patient lays down.

In the EKG we found ST-segment elevation in almost all leads. Also, we found a depression of the PR segment in the DII lead.

* -> EKG Analysis

:EKG:.

:Game: What do you want to do?
* Back -> Order EKG
* Analyze EKG -> EKG Analysis

## Check hypothesis (marker_exam)

<dcc-group-marker context="ekg" image="images/ekg.png">
   <dcc-image-marker id="DI" label="DI" coords="238,127,164,76" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DII" label="DII" coords="231,328,148,273" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="DIII" label="DIII" href="" coords="67,484,148,528" image="images/ekg-detail-02.png"></dcc-image-marker>
   <dcc-image-marker id="aVL" label="aVL" coords="413,286,515,332" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="IV" label="IV" coords="1005,40,1123,130" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="V" label="V" coords="1004,248,1133,323" image="images/ekg-detail-01.png"></dcc-image-marker>
   <dcc-image-marker id="VI" label="VI" coords="1010,460,1130,538" image="images/ekg-detail-01.png"></dcc-image-marker>
</dcc-group-marker>

* Submit -> Review hypothesis

## Review hypothesis (input)
If you whant to review your hypothesis, type below the new hypothesis.
:PATIENT Jakob:.
{?1 hypothesis:mesh#pericarditis,myopericarditis,pericardial inflammation,pericardial infection,pericardial effusion;infarction,myocardial infarction,coronary syndrome,acute coronary syndrome,ischemia,myocardial ischemia,coronary insufficiency,angina,angina pectoris}

* Submit -> Final.Report

Final
=====

Report (detailed)
-----------------

Congratulations, my young Dr. you could helped your patient providing his diagnosis. Now, Let's review all levels of this case.

:Computer:Select a final report level:

* -> Level 1
* -> Level 2.2a
* -> Level 3.3a

Level 1 (detailed)
------------------

<b>Level 1</b>: your answer was <dcc-expression expression="Cycle_1.Generate_hypothesis.hypothesis"></dcc-expression>.

Our patient complained about chest pain, located in the middle of his chest, worsening when he breaths and when he lay down on his bed. Both features increases the probability of pericardial disease, especially acute pericarditis. Although patient´s father died of a "heart attack", there were no chest pain features that increase the probability of myocardial infarction, as the pain did not irradiate to arms, the pain was not described as a pressure, neither complaining about nausea, vomiting or shortness of breath. Another differential diagnosis to consider is myopericarditis, but we not be able to find heart failure signs (pulmonary and cardiac auscultation were normal) and the patient did not complain about dyspnea. So, at the level 1, the answer to our open-ended question was Acute Pericarditis.

* Next -> Level 2.2a
* Return -> Report

Level 2
-------

### 2a (detailed)

<div style="font-size: 14px">
<b>Level 2</b>: At this level, we asked you to highlight in green all features that corroborate your hypothesis, in blue those are neutral and in red the ones speaking against your hypothesis.
<br><br>
<b>Your answer:</b>
<br>
{{player#Cycle_1.Check_hypothesis.symptoms: ,+,=,-
Nurse: Doctor, please you have to evaluate a {man(male)} ({51 years-old(aging=51)#=}) who entered the emergency department reporting {chest pain#=}.His vital signs are {ABP: 144x92mmHG#=}; {HR: 78bpm#=}; {RR: 21rpm#=}; {Temp: 37oC#=}; {O2Sat: 98%#=}.
<br>
Patient: Doctor, I am feeling chest pain since yesterday. The {pain is continuous#=} and {is located just in the middle of my chest#=}, {worsening when I breathe#+} and {when I lay down on my bed#+}. I have {arterial hypertension#-} and {I smoke 20 cigarettes(smoking=20/day)#-} every day. {My father had a "heart attack"#-} at my age and I am very worried about it.
<br>
You perform physical examination: {cardiac and pulmonary auscultation are normal#-}; {chest pain does not worse with palpation of the thorax#=}; {there is no jugular stasis#=} {nor lower limb edema#=}.
}}
<br><br>
<b>Our answer:</b> 
<br>
{{answers#answers: ,+,=,-
Nurse: Doctor, please you have to evaluate a {man(male)} ({51 years-old(aging=51)#=}) who entered the emergency department reporting {chest pain#=}.His vital signs are {ABP: 144x92mmHG#=}; {HR: 78bpm#=}; {RR: 21rpm#=}; {Temp: 37oC#=}; {O2Sat: 98%#=}.
<br>
Patient: Doctor, I am feeling chest pain since yesterday. The {pain is continuous#=} and {is located just in the middle of my chest#=}, {worsening when I breathe#+} and {when I lay down on my bed#+}. I have {arterial hypertension#-} and {I smoke 20 cigarettes(smoking=20/day)#-} every day. {My father had a "heart attack"#-} at my age and I am very worried about it.
<br>
You perform physical examination: {cardiac and pulmonary auscultation are normal#-}; {chest pain does not worse with palpation of the thorax#=}; {there is no jugular stasis#=} {nor lower limb edema#=}.
}}
</div>

* Next -> 2b
* Return -> Final.Report

### 2b (detailed)

After checking the hypothesis you reviewed your answer to: <dcc-expression expression="Cycle_1.Review_hypothesis.hypothesis"></dcc-expression>.

In acute pericarditis, patients are usually young, most cases are reported under 50 years old, but it can be diagnosed at any age. There is no vital signs features that increase the probability of this condition. Some patients may present fever and tachycardia, but it´s not common signs. So, when vital signs are normal, we cannot confirm or exclude this diagnosis.

In clinical history, two features increase the probability of the chest pain being related to a pericardial disease: worsening with breathing; and worsening when the patient lay down. 

* Next -> 2c
* Return -> Final.Report

### 2c (detailed)

As the patient has arterial hypertension, is smoker and his father died of a "heart attack" we could consider myocardial infarction as one of the diagnosis. But considering chest pain features of our patient, there is no one that increases this possibility. So, these features may lead us to cognitive error if we consider myocardial infarction as the main diagnosis (which is wrong). 

In physical examination in patients with acute pericarditis, we may find pericardial rub, one of the diagnostic criteria. So, when we did not find it, the probability of the disease is reduced, but did not exclude the diagnosis. It is crucial to look for the other diagnostic criteria.

* Next -> Level 3.3a
* Return -> Final.Report

Level 3
-------

### 3a (detailed)

My young Dr, the EKG interpretation was very helpful to solve our case.

We found a diffuse ST-segment elevation, and a PR-segment depression in DII lead.  These findings, associated to the clinical scenario, strongly indicate the main hypothesis of Acute Pericarditis.

* Next -> 3b
* Return -> Final.Report

### 3b (detailed)

My young Dr, the EKG interpretation was very helpful to solve our case.

We found a diffuse ST-segment elevation, and a PR-segment depression in DII lead.  These findings, associated to the clinical scenario, strongly indicate the main hypothesis of Acute Pericarditis.

* Next -> 3c
* Return -> Final.Report

### 3c (detailed)
<div style="font-size: 18px">
In the following table, we provide the diagnostic criteria for acute pericaditis and myopericarditis:

![Clinical History Myocardial Infarction](images/ebm-pericarditis.png)

Cooper LT, Imazio M. Management of myopericarditis. Expert Rev Cardiovasc Ther 2013; 11(2): 193-201.

Our patient fullfill the following criteria: 1 and 3. So, acute pericarditis is the main diagnostic hypothesis.
</div>

* Return -> Final.Report  
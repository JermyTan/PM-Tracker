from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import User, AccountType
from users.middlewares import check_account_access
from .serializers import PostFeedbackSerializer

## TODO: this is only a temporary implemention. Should not rely on webscraping in the long run.
def answer_reflection(driver, element_class, reflection):
    text_questions = driver.find_element(By.CLASS_NAME, element_class)
    text_questions.clear()
    text_questions.send_keys(reflection)

    return driver


def submit(driver, element_class):
    driver.find_element(By.CLASS_NAME, element_class).click()
    return driver


def get_result(driver, element_class):
    result = driver.find_element(By.CLASS_NAME, element_class).get_attribute("value")
    return result


# Returns a two element array of string containing HTML code
# First element contains the HTML of inline annotated reflection
# Segments of text to be highlighted are enclosed by <span> tags with the type of highlight found within the span's class.
# Classes of highlights include context, challenge, affect, modall, epistemic, link2me, change, metrics

# Second element contains the HTML of feedback for the student, provided in a two panel view


def analyse(text):

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    text_question_element_class = "ql-editor"
    submit_element_class = "btn-lg"

    url = "https://acawriter-demo.utscic.edu.au/demo"
    coreDriver = webdriver.Chrome(options=chrome_options)
    coreDriver.get(url)

    select_element = coreDriver.find_element(By.ID, "grammar")
    select_object = Select(select_element)
    select_object.select_by_visible_text("Pharmacy")
    driver = answer_reflection(coreDriver, text_question_element_class, text)
    driver = submit(driver, submit_element_class)
    element = WebDriverWait(driver=driver, timeout=60).until(
        EC.invisibility_of_element((By.CLASS_NAME, "nprogress-busy"))
    )

    element = driver.find_element(
        By.XPATH, "//div[contains(@class, 'col-md-12 wrapper')]"
    )
    results = []
    inlineFeedback = element.get_attribute("innerHTML")

    results.append(inlineFeedback)  # Inline text feedback

    element = driver.find_element(By.ID, "feedback")
    panelFeedback = element.get_attribute("innerHTML")

    # Changing name of analyser
    panelFeedback = panelFeedback.replace("AcaWriter", "Reflection Analyser")

    # Removing ineffective feedback
    panelFeedback = panelFeedback.replace(
        """<li class="col-md-12 p-2"><span class="text-danger"> While it appears that you’ve reported on how you would change/prepare for the future, you don’t seem to have reported first on what you found challenging. Perhaps you’ve reflected only on the positive aspects in your report?. </span></li>""",
        "",
    )
    results.append(panelFeedback)  # Panel text feedback

    coreDriver.close()
    return results


# Create your views here.
class FeedbackView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    def post(self, request, requester: User):
        serializer = PostFeedbackSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        annotated_content, feedback = analyse(serializer.validated_data["content"])

        data = {"annotated_content": annotated_content, "feedback": feedback}

        return Response(data=data, status=status.HTTP_200_OK)

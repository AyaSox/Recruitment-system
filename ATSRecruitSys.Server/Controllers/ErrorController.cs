using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ATSRecruitSys.Server.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [Route("/error")]
        public IActionResult HandleError()
        {
            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = exceptionHandlerFeature?.Error;

            if (exception != null)
            {
                _logger.LogError(exception, "Unhandled exception occurred");
            }

            return Problem(
                title: "An error occurred while processing your request.",
                statusCode: (int)HttpStatusCode.InternalServerError
            );
        }

        [Route("/error-development")]
        public IActionResult HandleErrorDevelopment([FromServices] IWebHostEnvironment webHostEnvironment)
        {
            if (!webHostEnvironment.IsDevelopment())
            {
                return NotFound();
            }

            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = exceptionHandlerFeature?.Error;

            return Problem(
                detail: exception?.StackTrace,
                title: exception?.Message,
                statusCode: (int)HttpStatusCode.InternalServerError
            );
        }
    }
}
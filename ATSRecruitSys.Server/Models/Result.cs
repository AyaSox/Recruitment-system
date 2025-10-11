namespace ATSRecruitSys.Server.Models
{
    /// <summary>
    /// Represents the result of an operation with data
    /// </summary>
    /// <typeparam name="T">The type of data returned</typeparam>
    public class Result<T>
    {
        public bool IsSuccess { get; init; }
        public T? Data { get; init; }
        public string? ErrorMessage { get; init; }
        public List<string> Errors { get; init; } = new();

        /// <summary>
        /// Creates a successful result with data
        /// </summary>
        public static Result<T> Success(T data) => new()
        {
            IsSuccess = true,
            Data = data
        };

        /// <summary>
        /// Creates a failed result with an error message
        /// </summary>
        public static Result<T> Failure(string errorMessage) => new()
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            Errors = new List<string> { errorMessage }
        };

        /// <summary>
        /// Creates a failed result with multiple error messages
        /// </summary>
        public static Result<T> Failure(List<string> errors) => new()
        {
            IsSuccess = false,
            ErrorMessage = string.Join("; ", errors),
            Errors = errors
        };

        /// <summary>
        /// Creates a failed result from an exception
        /// </summary>
        public static Result<T> Failure(Exception ex) => new()
        {
            IsSuccess = false,
            ErrorMessage = ex.Message,
            Errors = new List<string> { ex.Message }
        };
    }

    /// <summary>
    /// Represents the result of an operation without data
    /// </summary>
    public class Result
    {
        public bool IsSuccess { get; init; }
        public string? ErrorMessage { get; init; }
        public List<string> Errors { get; init; } = new();

        /// <summary>
        /// Creates a successful result
        /// </summary>
        public static Result Success() => new()
        {
            IsSuccess = true
        };

        /// <summary>
        /// Creates a failed result with an error message
        /// </summary>
        public static Result Failure(string errorMessage) => new()
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            Errors = new List<string> { errorMessage }
        };

        /// <summary>
        /// Creates a failed result with multiple error messages
        /// </summary>
        public static Result Failure(List<string> errors) => new()
        {
            IsSuccess = false,
            ErrorMessage = string.Join("; ", errors),
            Errors = errors
        };

        /// <summary>
        /// Creates a failed result from an exception
        /// </summary>
        public static Result Failure(Exception ex) => new()
        {
            IsSuccess = false,
            ErrorMessage = ex.Message,
            Errors = new List<string> { ex.Message }
        };

        /// <summary>
        /// Converts a Result to Result<T>
        /// </summary>
        public Result<T> ToGeneric<T>(T? data = default) => data == null
            ? Result<T>.Failure(ErrorMessage ?? "Operation failed")
            : Result<T>.Success(data);
    }
}
